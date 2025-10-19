import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Zdemy dashboard",
  description: "Admin dashboard for zdemy ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ✅ Cloudinary widget script */}
        <Script
          src="https://upload-widget.cloudinary.com/latest/global/all.js"
          strategy="beforeInteractive"
        />

        {/* ✅ Cloudinary initialization script */}
        <Script id="cloudinary-widget-setup" strategy="afterInteractive">
          {`
    
    function initCloudinaryWidget() {
      if (typeof cloudinary === "undefined") {
        console.warn("Cloudinary not loaded yet.");
        setTimeout(initCloudinaryWidget, 500);
        return;
      }

      var myWidget = cloudinary.createUploadWidget(
        {
          cloudName: 'my_cloud_name',
          uploadPreset: 'my_preset'
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log('Done! Here is the image info: ', result.info);
          }
        }
      );


      const waitForButton = setInterval(() => {
        const btn = document.getElementById("upload_widget");
        if (btn) {
          clearInterval(waitForButton);
          btn.addEventListener("click", () => myWidget.open(), false);
          console.log("Cloudinary upload button ready ✅");
        }
      }, 500);
    }

    initCloudinaryWidget();
  `}
        </Script>

        {children}
      </body>
    </html>
  );
}
