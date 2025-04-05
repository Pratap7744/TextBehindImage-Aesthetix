import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DesignBlog = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      category: "Tutorial",
      title: "How to Place Text Behind a Subject in Just 3 Steps!",
      excerpt: "Placing text behind a subject is a popular design technique that adds depth and creativity to your images. Whether you're making social media posts, advertisements, or personal projects, mastering this effect can elevate your designs to a professional level.\n\nThe process involves selecting the right image, isolating the subject, and carefully positioning the text to make it blend seamlessly. The key is ensuring the text remains legible while maintaining a natural integration with the background.\n\nIn this tutorial, we'll guide you through a step-by-step approach to achieving this effect effortlessly. You don't need advanced editing skills—just the right tools and techniques.\n\nFirst, we'll start by choosing an appropriate image with a clear subject. Then, we'll walk through methods to separate the subject from the background, allowing the text to be positioned behind it. Finally, we'll adjust the opacity, color, and font to enhance visibility without compromising the image's aesthetics.\n\nBy the end of this guide, you'll be able to create stunning images with text perfectly placed behind any subject. Let's dive in and make your designs stand out!",
      date: "2025-01-12"
    },
    {
      id: 2,
      category: "Tutorial",
      title: "Creating Outlined Text on Images: A Step-by-Step Guide",
      excerpt: "Adding outlined text to your images is a fantastic way to make words stand out without covering important elements of your design. This effect keeps the text readable while maintaining the integrity of the background image.\n\nUnlike regular text, outlined text has a transparent center, allowing the image underneath to show through. This is particularly useful for aesthetic designs, marketing graphics, and modern digital art. By controlling the thickness and color of the outline, you can make the text visually appealing without overpowering the main subject.\n\nIn this tutorial, we will explore different ways to create outlined text using various tools. Whether you're a beginner or a seasoned designer, these techniques will help you enhance your visuals with precision.\n\nWe'll start with choosing the right font and color combinations. Then, we'll move on to adjusting stroke thickness to ensure readability. Finally, we'll discuss positioning techniques to place the text strategically in your design.\n\nBy the end of this guide, you'll have mastered the art of outlined text, adding a professional touch to all your creative projects.",
      date: "2025-01-10"
    },
    {
      id: 3,
      category: "Trends",
      title: "Why Text-Behind-Subject is the Hottest Social Media Trend",
      excerpt: "If you've scrolled through social media lately, you've probably noticed the growing trend of placing text behind the main subject. This creative technique has taken the digital design world by storm, making images look more polished and visually engaging.\n\nOne of the main reasons this effect has become so popular is its ability to add depth and dimension to images. Instead of just overlaying text on top, placing it behind the subject creates a natural blend that makes the design feel more immersive.\n\nMarketers, influencers, and content creators use this technique to make their posts stand out. Whether it's for Instagram stories, YouTube thumbnails, or promotional banners, the text-behind-subject effect instantly grabs attention and makes people stop scrolling.\n\nThis effect also works well for branding. Many top brands now use this method to create sleek, professional-looking advertisements. The strategic placement of text ensures that the subject remains the focal point while still conveying an impactful message.\n\nIn this article, we will break down why this trend is here to stay, how to execute it effectively, and what tools you can use to achieve the best results.",
      date: "2025-01-08"
    },
    {
      id: 4,
      category: "Design Tips",
      title: "Choosing the Best Fonts for Text Effects",
      excerpt: "Fonts play a crucial role in design, especially when applying effects like text-behind-subject, outlined text, or transparency overlays. Choosing the wrong font can make text unreadable, unappealing, or out of place in your composition.\n\nDifferent fonts evoke different emotions. A bold sans-serif font creates a modern, eye-catching effect, while a delicate script font adds elegance. Understanding these differences is key to making the right choice.\n\nBeyond aesthetics, readability is essential. Thin fonts might disappear against a busy background, while overly decorative fonts can become difficult to read at smaller sizes. The goal is to strike a balance between style and clarity.\n\nThis guide will explore the best font choices for various text effects. We'll cover factors like font weight, spacing, and pairing techniques to ensure your designs look cohesive and professional.\n\nBy the end of this article, you'll have a clear understanding of how to select and use fonts effectively for visually stunning text effects.",
      date: "2025-01-07"
    },
    {
      id: 5,
      category: "Tips & Tricks",
      title: "Top 5 Mistakes to Avoid When Adding Text to Images",
      excerpt: "Adding text to images seems simple, but many designers make common mistakes that can ruin the overall aesthetic. Understanding these pitfalls can help you create clean, professional, and visually appealing designs.\n\nOne of the biggest mistakes is poor font choice. Using overly decorative or hard-to-read fonts can make the text blend into the background, reducing its impact. Selecting the right font style and size is crucial.\n\nAnother common issue is bad positioning. Placing text in a cluttered area can make it hard to read. Strategic placement ensures that the text remains the focal point without overwhelming the image.\n\nColor contrast is also essential. If the text color is too similar to the background, it becomes unreadable. Using shadows, outlines, or bold colors can help maintain visibility.\n\nFinally, overloading an image with too much text can be overwhelming. Keeping messages concise and using proper spacing makes for a more visually appealing design.\n\nThis article will dive deeper into these mistakes and provide expert tips on how to avoid them, ensuring your text-based designs always look professional.",
      date: "2025-01-05"
    }
  ];
  
  const openPost = (post) => {
    setSelectedPost(post);
  };
  
  const closePost = () => {
    setSelectedPost(null);
  };
  
  // Format date to display in required format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Function to truncate excerpt to 2-3 lines
  const truncateExcerpt = (excerpt, maxLines = 3) => {
    const lines = excerpt.split('\n');
    return lines.slice(0, maxLines).join(' ');
  };
  
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      {/* Navigation header */}
      <div className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm py-4 px-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-indigo-300" />
                <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
                <span className="font-bold text-xl text-gray-900">𝘈
                </span>
                </div>
              </div>
              <Link to={"/"}>
              <span className="font-extrabold text-2xl text-gray-800 tracking-tight">
              Aesthetix
              </span>
              </Link>
            </div>
            <Link to={"/"}>
            <button 
              className="bg-gradient-to-r from-purple-300 to-indigo-300 text-gray-800 font-medium py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              Back to Home
            </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main blog grid with padding to account for fixed header */}
      <div className="container mx-auto pt-24 p-6">
        <h1 className="text-4xl font-bold mb-12 text-gray-800">Design Resources & Tutorials</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div 
              key={post.id}
              onClick={() => openPost(post)}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-indigo-500 mb-2">{post.category}</div>
              <h2 className="text-xl font-bold mb-3 text-gray-800">{post.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{truncateExcerpt(post.excerpt)}</p>
              <p className="text-gray-400 text-sm">{formatDate(post.date)}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Detailed blog view */}
      {selectedPost && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          {/* Navigation in detailed view */}
          <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm py-4 px-6 shadow-md">
            <div className="container mx-auto">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-indigo-300" />
                    <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
                      <span className="font-bold text-indigo-500">TB</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-2xl text-gray-800 tracking-tight">
                    TextBack
                  </span>
                </div>
                
                <button 
                  onClick={closePost}
                  className="bg-gradient-to-r from-purple-300 to-indigo-300 text-gray-800 font-medium py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Back to Blogs
                </button>
              </div>
            </div>
          </div>

          <div className="container mx-auto py-12 px-6 max-w-4xl">
            <div className="mt-8">
              <h1 className="text-4xl font-bold mb-4 text-gray-800">{selectedPost.title}</h1>
              <div className="inline-block bg-gradient-to-r from-purple-300 to-indigo-300 text-gray-800 px-3 py-1 rounded-full text-sm mb-4">{selectedPost.category}</div>
              
              {/* Full excerpt when post is opened */}
              <p className="text-gray-600 mb-4 whitespace-pre-line">{selectedPost.excerpt}</p>
              <p className="text-gray-400 mb-8">{formatDate(selectedPost.date)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignBlog;