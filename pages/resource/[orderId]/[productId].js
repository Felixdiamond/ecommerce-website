import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { useEffect, useState, useCallback } from "react";
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
import cookie from "cookie";
import CryptoJS from "crypto-js";
import { useSwipeable } from "react-swipeable";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Notify, { notify } from "@/components/Notification";

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

const ParentNavDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: absolute;
`;

const NavigationDiv = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  position: relative;
  margin-top: 5rem;
  background: transparent;
  position: absolute;
  transform: translateY(-50%);
`;

const Center = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 90vh;
  position: absolute;
  padding: 0 1rem;
  overflow-y: none;
`;

const StyledSvg = styled.div`
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  /* max-width: 3rem;
  max-height: 3rem; */
  /* box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15); */
  z-index: 50;
`;

const TitleTxt = styled.div`
  text-align: center;
`;

const StyledMediaPlayer = styled(MediaPlayer)`
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
`;

const OgaDiv = styled.div`
  max-height: 100vh;
  overflow-y: none;
`;

export default function ResourcePage({ user, resource, type, productName }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);

  notify("Swipe left or right to navigate, or use the arrow button", "info");

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
    const name = url.substring(url.lastIndexOf("/") + 1);

    fetch("/api/getPdf?url=" + url)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
        const file = new File([arrayBuffer], name);
        setPdfFile(file);
      });
  }, [resource]); // Add any dependencies here

  useEffect(() => {
    getPdf();
  }, [getPdf]);

  const handlers = useSwipeable({
    onSwipedLeft: () => nextPage(),
    onSwipedRight: () => previousPage(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <OgaDiv {...handlers}>
      <Notify />
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
              <StyledSvg onClick={previousPage} disabled={pageNumber <= 1}>
                <FaChevronLeft size={40} />
              </StyledSvg>
              <StyledSvg onClick={nextPage} disabled={pageNumber >= numPages}>
                <FaChevronRight size={40} />
              </StyledSvg>
            </NavigationDiv>
            <p>
              {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
            </p>
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
    </OgaDiv>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { orderId, productId, type } = context.query;

  const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;
  const cookies = cookie.parse(context.req.headers.cookie || "");

  // Get the encrypted user data from the cookie
  const ciphertext = cookies.user;

  if (!ciphertext) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Decrypt the user data
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const order = await Order.findOne({ _id: orderId });
  const product = order.products.find(
    (product) => product.id.toString() === productId
  );
  const productName = product.name;

  if (user.purchaseHistory.includes(orderId) == false) {
    console.log("User does not own this product");
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  var resource;
  if (type == "pdf") {
    resource = product.pdf;
  } else if (type == "video") {
    resource = product.video;
  } else if (type == "audio") {
    resource = product.audio;
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
