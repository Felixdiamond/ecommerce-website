import { useState } from "react";
import styled from "styled-components";

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const BigImageWrapper = styled.div`
  text-align: center;
`;

const BigImage = styled.img`
  max-width: 100%;
`;

const ImageButtons = styled.div`
  padding-top: 30px;
  display: flex;
  gap: 10px;
  flex-grow: 0;
`;

const ImageButton = styled.div`
  ${(props) =>
    props.active
      ? `
            border: 1px solid rgba(0, 0, 0, 0.15);
        `
      : `
            border-color: transparent;
            opacity: 0.9;
        `}
  border-radius: 3px;
  height: 50px;
  padding: 5px;
  cursor: pointer;
`;

export default function ProductImages({ images }) {
  const [activeImage, setActiveImage] = useState(images?.[0]);
  return (
    <>
      <BigImageWrapper>
        <BigImage src={activeImage} alt="" />
      </BigImageWrapper>
      <ImageButtons>
        {images
          .filter((image) => {
            const lowerCaseImage = image.toLowerCase();
            return (
              lowerCaseImage.endsWith(".jpg") ||
              lowerCaseImage.endsWith(".jpeg") ||
              lowerCaseImage.endsWith(".png") ||
              lowerCaseImage.endsWith(".gif") ||
              lowerCaseImage.endsWith(".bmp") ||
              lowerCaseImage.endsWith(".tif") ||
              lowerCaseImage.endsWith(".webp") ||
              lowerCaseImage.endsWith(".heif")
            );
          })
          .map((image) => (
            <ImageButton
              active={image === activeImage}
              key={image}
              onClick={() => setActiveImage(image)}
            >
              <Image src={image} alt="" />
            </ImageButton>
          ))}
      </ImageButtons>
    </>
  );
}
