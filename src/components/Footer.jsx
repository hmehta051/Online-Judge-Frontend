import React from "react";
import { FaGithub, FaTwitter, FaLinkedin, FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 p-6 text-center">
      <div className="mb-4">
        <img
          src="https://ik.imagekit.io/bksgfrlfg/logo_daad_dAnA.png?updatedAt=1716035561396"
          alt="CodeKing"
          className="w-24 mx-auto"
        />
      </div>
      <div className="flex justify-center mb-4">
        <a
          href="https://github.com/hmehta051"
          target="_blank"
          className="text-[#527450] mx-3 text-2xl"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://x.com/hmehta051"
          target="_blank"
          className="text-[#527450] mx-3 text-2xl"
          aria-label="Twitter"
        >
          <FaTwitter />
        </a>
        <a
          href="https://linkedin.com/in/hemendramaheta"
          target="_blank"
          className="text-[#527450] mx-3 text-2xl"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://hmehta051.netlify.app/"
          target="_blank"
          className="text-[#527450] mx-3 text-2xl"
          aria-label="Portfolio"
        >
          <FaGlobe />
        </a>
      </div>
      <div className="mb-4">
        <Link to="/about-us" className="text-[#527450] no-underline mx-2">
          About Us
        </Link>
      </div>
      <div>
        <p className="text-[#527450]">© 2024 CodeKing. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
