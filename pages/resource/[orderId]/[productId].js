import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { useEffect, useState } from "react";
import supabase from "@/lib/connSupa";
import axios from "axios";
import { useRouter } from "next/router";
import Center from "@/components/Center";
import { Document, Page, pdfjs } from "react-pdf";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import styled from "styled-components";
import CustomLoading from "@/components/CustomLoading";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const StyledPage = styled(Page)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  user-select: none;
  @media screen and (max-width: 767px) {
    max-width: 100%; // Set max-width to 100%
    padding: 0;
    canvas {
    max-width: 100%;
    height: auto !important;
    object-fit: contain;
  }
  }
`;

const StyledDocument = styled(Document)`
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;


const NavigationDiv = styled.div`
  width: 8rem;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  position: relative;
  margin-bottom: 1rem;
`;

const StyledSvg = styled.svg`
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  max-width: 2rem;
  max-height: 2rem;
`;

const TitleTxt = styled.div`
  text-align: center;
`;

const StyledMediaPlayer = styled(MediaPlayer)`
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
`;

export default function ResourcePage({ resource, type, orderId, productName }) {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState({});
  const [calledAlready, setCalledAlready] = useState(false);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);
  const [fetchOnce, setFetchOnce] = useState(false);

  const disableRightClick = (e) => {
    e.preventDefault();
  };

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  if (
    session &&
    calledAlready == false &&
    session.data &&
    session.data.session &&
    session.data.session.user
  ) {
    console.log(session.data.session.user.id);
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (
        session &&
        session.data &&
        session.data.session &&
        session.data.session.user
      ) {
        try {
          await axios
            .post("/api/findByEmail", {
              email: session.data.session.user.email,
            })
            .then((res) => {
              setUser(res.data.data);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error in axios.post:", error);
            });
        } catch (error) {
          console.error(error);
        }
      }
      setCalledAlready(true);
    };
    fetchCurrentUser();
  }, [session, calledAlready]);

  useEffect(() => {
    if (!loading && !user?.purchaseHistory?.includes(orderId)) {
      router.push("/404");
    }
  }, [session, router, resource, user, orderId, loading]);

  function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
  }

  useEffect(() => {
    document.addEventListener("contextmenu", disableRightClick);
    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);


  const getPdf = useCallback(() => {
    // Extract filename from URL
    const url = resource;
    const name = url.substring(url.lastIndexOf('/')+1); 
  
    if (fetchOnce == true) return;
  
    fetch('/api/getPdf?url=' + url)
      .then(res => res.arrayBuffer())
      .then(arrayBuffer => {
        const file = new File([arrayBuffer], name);
        setPdfFile(file);
        setFetchOnce(true);
      }); 
  }, [resource, fetchOnce]); // Add any dependencies here
  
  useEffect(() => {
    getPdf();
  }, [getPdf]);  

  return (
    <>
      <Header />
      <Center>
        <TitleTxt>
          <h1>{productName}</h1>
        </TitleTxt>
        {resource && type == "pdf" ? (
          <>
            <StyledDocument
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onContextMenu={(e) => e.preventDefault()}
              loading={<CustomLoading />}
            >
              <StyledPage
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </StyledDocument>
            <NavigationDiv>
              <StyledSvg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                disabled={pageNumber <= 1}
                onClick={previousPage}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </StyledSvg>
              <p>
                {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
              </p>
              <StyledSvg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                disabled={pageNumber >= numPages}
                onClick={nextPage}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </StyledSvg>
            </NavigationDiv>
          </>
        ) : (
          <StyledMediaPlayer
            title={productName}
            src={resource}
            onContextMenu={(e) => e.preventDefault()}
          >
            <MediaProvider />
            <DefaultVideoLayout icons={defaultLayoutIcons} />
          </StyledMediaPlayer>
        )}
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { orderId, productId, type } = context.query;

  const order = await Order.findOne({ _id: orderId });
  const product = order.products.find(
    (product) => product.id.toString() === productId
  );
  const productName = product.name;

  var resource;

  if (type == "pdf") {
    resource = product.pdf;
  } else if (type == "video") {
    resource = product.video;
  } else {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      resource: resource,
      type: type,
      orderId: orderId,
      productName: productName,
    },
  };
}
