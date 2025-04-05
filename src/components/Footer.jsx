import React from "react";

const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-gradient-to-br from-gray-50 to-indigo-100/30 text-gray-900">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="col-span-2 lg:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600 tracking-tight">
              Aesthetix
            </h3>
            <p className="text-gray-700 mb-6">Create stunning visuals in minutes.</p>
          </div>
          {[
            { 
              title: "Connect", 
              links: [
                { name: "Twitter", url: "https://x.com/_Pratap_7744", isExternal: true }
              ] 
            },
            { 
              title: "Product", 
              links: [
                { name: "Work", url: "#showcase", isExternal: false }, 
                { name: "Features", url: "#features", isExternal: false }, 
                { name: "How it works", url: "#howitworks", isExternal: false }
              ] 
            },
            { 
              title: "Resources", 
              links: [
                { name: "Blog", url: "/blogs", isExternal: false }, 
              ] 
            },
            { 
              title: "Company", 
              links: [
                { name: "Privacy Policy", url: "/privacypolicy", isExternal: false }
              ] 
            },
          ].map((column, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4 text-gray-900">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url}
                      className="text-gray-700 hover:text-indigo-400 transition-colors duration-300"
                      target={link.isExternal ? "_blank" : "_self"}
                      rel={link.isExternal ? "noopener noreferrer" : ""}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-indigo-200/50 text-center text-gray-700 text-sm">
          © 2025 Aesthetix. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;