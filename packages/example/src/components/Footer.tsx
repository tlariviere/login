import React from "react";

import "./Footer.scss";

interface SocialNetworkProps {
  name: string;
  href: string;
}

const SocialNetwork: React.FC<SocialNetworkProps> = ({ name, href }) => (
  <a
    className="SocialNetwork"
    href={href}
    target="_blank"
    rel="noreferrer"
    role="button"
  >
    <i className={`bi bi-${name}`} />
  </a>
);

const Footer: React.FC = () => (
  <footer className="Footer">
    <div className="my-1">
      <SocialNetwork
        name="linkedin"
        href="https://www.linkedin.com/in/thibaud-lariviere"
      />
      <SocialNetwork name="github" href="https://github.com/tlariviere" />
    </div>
    <p className="text-white-50">
      &copy; {new Date().getFullYear()} Thibaud Larivière
    </p>
  </footer>
);

export default Footer;
