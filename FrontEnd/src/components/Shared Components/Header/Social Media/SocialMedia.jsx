import React from 'react'
import { FaFacebook, FaInstagram, FaTiktok,FaWhatsapp } from "react-icons/fa6";
import { useSocialMedias } from '../../../../Hooks/useSocialMedias';
import { SiGmail } from "react-icons/si";
const FacebookLink=import.meta.env.VITE_facebook;
const InstagramLink=import.meta.env.VITE_INSTAGRAM;
const Number=import.meta.env.VITE_NUMBER;
const gmail=import.meta.env.VITE_GMAIL;

function SocialMedia({className}) {
    const [data] = useSocialMedias();
    return (
        <div className="socialMedia hidden sm:flex items-center gap-[10px]">
            <a
                href={data?.facebook || "#"}
                className='facebook'
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaFacebook className={className} />
            </a>
            <a href={data?.instagram || "#"} className='instagram'>
                <FaInstagram className={className}  />
            </a>
            <a href={ data?.tiktok || "#"}className='tiktok'>
                <FaTiktok className={className}  />
            </a>
            <a href={data?.whatssap || ""} className='whatsapp'>
                <FaWhatsapp className={className}  />
            </a>
            <a href={`mailto:${data?.email}` || ""} className='gmail'>
                <SiGmail className={className}  />
            </a>

        </div>
    )
}

export default SocialMedia