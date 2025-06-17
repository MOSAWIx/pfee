import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaSnapchatGhost } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import { useEffect } from "react";
import WebAxiosConfig from "../config/webAxiosConfig";
import { useState } from "react";

const socialMediaLinks = [
  {
    name: "facebook",
    icon: <FaFacebookF />,
    url: "https://www.facebook.com",
    label: "Facebook",
  },
  {
    name: "twitter",
    icon: <FaTwitter />,
    url: "https://www.twitter.com",
    label: "Twitter",
  },
  {
    name: "instagram",
    icon: <FaInstagram />,
    url: "https://www.instagram.com",
    label: "Instagram",
  },
  {
    name: "linkedin",
    icon: <FaLinkedinIn />,
    url: "https://www.linkedin.com",
    label: "LinkedIn",
  },
  {
    name: "youtube",
    icon: <FaYoutube />,
    url: "https://www.youtube.com",
    label: "YouTube",
  },
  {
    name: "tiktok",
    icon: <FaTiktok />,
    url: "https://www.tiktok.com",
    label: "TikTok",
  },
  {
    name: "snapchat",
    icon: <FaSnapchatGhost />,
    url: "https://www.snapchat.com",
    label: "Snapchat",
  },
  {
    name: "pinterest",
    icon: <FaPinterestP />,
    url: "https://www.pinterest.com",
    label: "Pinterest",
  },
  {
    name: "whatsapp",
    icon: <BsWhatsapp />,
    url: "https://www.whatsapp.com",
    label: "WhatsApp",
  },
];
const useSocialMedias = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSocialMediaLinks = async () => {
      try {

        const response = await WebAxiosConfig.get("/social-media");
        if (response.status !== 200) {
          throw new Error("Failed to fetch social media links");
        }
        setData(response.data.data);
        // Assuming the response data is an array of social media links
      } catch (error) {
        console.error("Error fetching social media links:", error);
        setData([]); // Fallback to default links
      }
    };

    fetchSocialMediaLinks();

  }, []);

  return [data];
};

export { useSocialMedias };
