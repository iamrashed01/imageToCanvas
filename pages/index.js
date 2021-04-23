import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import UserSettings from "../components/userSettings";

export default function Home() {
  // settings
  const [state, setState] = useState({
    zip_filename: "",
    bg_color: "",
    label_color: "",
    filterAble: false,
    uploadImagesSize: "",
    downloadImagesSize: "",
  });

  const toggleFilterAble = () => {
    setState({
      zip_filename: "",
      bg_color: "",
      label_color: "",
      filterAble: !state.filterAble,
      uploadImagesSize: "",
    });
  };

  const clearCanvasCurrentInfo = () => {
    setState({
      ...state,
      uploadImagesSize: "",
      downloadImagesSize: "",
    });
    setBs64List(null);
  };

  const changeHandler = ({ target: { name, value } }) => {
    setState({ ...state, [name]: value });
  };

  const [bs64List, setBs64List] = useState(null);

  // reciving the images from onchange handdler
  const getImagesHandler = async ({ target: { files } }) => {
    let bs64Array = [];
    setBs64List([]);

    let totalUploadedBytes = 0;
    let totalDownloadedBytes = 0;

    if (files.length > 0) {
      for await (const file of files) {
        try {
          totalUploadedBytes += file.size;
          const canvas = await convertFileIntoCanvas(
            file,
            state.bg_color,
            state.label_color
          );
          // convert canvas into bs64 and push into an array[]
          if (canvas) {
            const dataURL = canvas.toDataURL();
            const head = "data:image/png;base64,";
            let imgFileSize = Math.round(
              ((dataURL.length - head.length) * 3) / 4
              );
            totalDownloadedBytes += imgFileSize;
            bs64Array.push({ bs64: dataURL, fileName: file.name });
          }
        } catch (error) {
          console.error(error.message);
        }
      }

      // client download given images as zip
      if (bs64Array.length > 0) {
        // save bs64 array into state
        setBs64List(bs64Array);
        // install download
        // downloadImageAsZip(bs64Array, state.zip_filename);

        //set total file size
        setState({
          ...state,
          uploadImagesSize: formatSizeUnits(totalUploadedBytes),
          downloadImagesSize: formatSizeUnits(totalDownloadedBytes),
        });
        // console.log(formatSizeUnits(totalBytes), "total file size");
      }
    } else {
      clearCanvasCurrentInfo();
    }
  };

  const formatSizeUnits = (bytes) => {
    if (bytes >= 1073741824) {
      bytes = (bytes / 1073741824).toFixed(2) + " GB";
    } else if (bytes >= 1048576) {
      bytes = (bytes / 1048576).toFixed(2) + " MB";
    } else if (bytes >= 1024) {
      bytes = (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes > 1) {
      bytes = bytes + " bytes";
    } else if (bytes == 1) {
      bytes = bytes + " byte";
    } else {
      bytes = "0 bytes";
    }
    return bytes;
  };

  const downloadConvertedImages = () => {
    downloadImageAsZip(bs64List, state.zip_filename);
    return clearCanvasCurrentInfo();
  };

  const resetData = () => {
    clearCanvasCurrentInfo();
  };

  // download bs64->images as zip
  async function downloadImageAsZip(bs64Array, zip_filename) {
    let zip = new JSZip();
    const zipFileName = zip_filename || "image-to-canvas";

    // const imagesFolder = zip.folder("images_folder");
    for await (const obj of bs64Array) {
      await zip.file(
        obj.fileName,
        obj.bs64.replace("data:image/png;base64,", ""),
        {
          base64: true,
        }
      );
    }

    // generate zip blob file
    zip.generateAsync({ type: "blob" }).then(function (content) {
      // save as zip file
      saveAs(content, `${zipFileName.replace(/\.[^/.]+$/, "")}.zip`);
    });
  }

  const convertFileIntoCanvas = (file, bg_color, label_color) => {
    var _URL = window.URL || window.webkitURL;
    var img;

    return new Promise((resolve, reject) => {
      img = new Image();
      var objectUrl = _URL.createObjectURL(file);
      img.onload = function () {
        const canvas = createPlaceholderCanvas(
          this.height,
          this.width,
          bg_color,
          label_color
        );
        _URL.revokeObjectURL(objectUrl);

        // resolve while img on load success
        return resolve(canvas);
      };

      // reject while img on error occured
      img.onerror = function (error) {
        return reject(error);
      };
      img.src = objectUrl;
    });
  };

  const createPlaceholderCanvas = (height, width, bg_color, label_color) => {
    // variables
    const canvas_background_color = bg_color || "rgb(250 250 250)";
    const text_color = label_color || "rgb(133 119 119)";

    // create canvas element
    let canvas = document.createElement("canvas");

    // resize canvas
    canvas.width = width;
    canvas.height = height;

    // canvas getContext as 2d view
    let ctx = canvas.getContext("2d");
    // styling the canvas
    ctx.fillStyle = canvas_background_color;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = text_color;

    // below is adding and styling text/label to canvas
    ctx.font = `${16}px serif`;
    ctx.font = `${4}vw serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.direction = "inherit";
    // add fill text into canvas
    ctx.fillText(`${height} * ${width}`, width / 2, height / 2);

    // draw image
    // ctx.drawImage(img, 10, 10);

    // print the canvas into html body
    // document.body.appendChild(canvas);

    return canvas;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Image To Canvas | Image Placholder Generator</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content="Image To Canvas | Image Placeholder Maker"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://imagetocanvas.vercel.app/" />
        <meta property="og:image" content="/banner.jpg" />
        <meta
          property="og:description"
          content="ImageToCanvas - Free online Open Source placeholder image generator tool."
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to{" "}
          <a href="https://github.com/iamrashed01/imageToCanvas">
            ImageToCanvas
          </a>
        </h1>

        <p className={styles.description}>
          Get started by Uploading <code className={styles.code}>Images</code>
        </p>

        <div className={styles.screen}>
          <UserSettings
            values={state}
            toggleFilterAble={toggleFilterAble}
            onChange={changeHandler}
          />
          <div className={styles.mainControllerButtons}>
            {bs64List && bs64List.length > 0 ? (
              <>
                <button
                  onClick={downloadConvertedImages}
                  className={styles.downloadButton}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-download"
                    viewBox="0 0 16 16"
                  >
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={resetData}
                  className={[styles.downloadButton, styles.eraserBtn].join(
                    " "
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-eraser-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" />
                  </svg>
                </button>
              </>
            ) : (
              <label htmlFor="upload" className={styles.uploadImage}>
                {bs64List === null && "Upload"}
                {bs64List && bs64List.length <= 0 && (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className={`bi bi-arrow-repeat ${styles.rotaing}`}
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                      <path
                        fillRule="evenodd"
                        d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                      />
                    </svg>
                    Processing
                  </>
                )}
                <input
                  multiple
                  id="upload"
                  onChange={getImagesHandler}
                  accept="image/*"
                  type="file"
                />
              </label>
            )}
          </div>

          <div className={styles.screenFooter}>
            <div className={styles.uploadSize}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-cloud-arrow-up"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"
                />
                <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
              </svg>

              {state.uploadImagesSize && state.uploadImagesSize}
            </div>
            <div className={styles.downloadSize}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-cloud-arrow-down"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M7.646 10.854a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 9.293V5.5a.5.5 0 0 0-1 0v3.793L6.354 8.146a.5.5 0 1 0-.708.708l2 2z"
                />
                <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
              </svg>
              {state.downloadImagesSize && state.downloadImagesSize}
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/iamrashed01"
          target="_blank"
          rel="noopener noreferrer"
        >
          Copyright by<strong className={styles.brandTitle}>iamrashed01</strong>
        </a>
      </footer>
    </div>
  );
}
