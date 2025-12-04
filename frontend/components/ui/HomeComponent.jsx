import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Nav from "@/components/Navbar";

export const ContainerScroll = ({
  users,
  titleComponent,
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="relative z-10">
      <Nav />
      <div
        className="h-[80rem] flex items-center justify-center relative p-20"
        ref={containerRef}
      >
        <div
          className="py-40 w-full relative"
          style={{
            perspective: "1000px",
          }}
        >
          <Header translate={translate} titleComponent={titleComponent} />
          <Card
            rotate={rotate}
            translate={translate}
            scale={scale}
            users={users}
          />
        </div>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  translate,
  users,
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border border-white/10 p-6 bg-black/40 backdrop-blur-xl rounded-[30px] shadow-2xl"
    >
      <div className="bg-white/5 h-full w-full rounded-2xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-hidden p-4 border border-white/5">
        {users.map((user, idx) => (
          <motion.div
            key={`user-${idx}`}
            className="bg-white/10 rounded-xl cursor-pointer relative overflow-hidden group hover:bg-white/20 transition-all duration-300 border border-white/5"
            style={{ translateY: translate }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="absolute top-2 right-2 rounded-full text-[10px] font-bold bg-neon-violet text-white px-2 py-0.5 z-10 shadow-lg">
              {user.badge}
            </div>
            <div className="relative h-40 w-full overflow-hidden">
                <img
                src={user.image}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="thumbnail"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
            </div>
            <div className="p-4 relative">
              <h1 className="font-semibold text-sm text-white group-hover:text-neon-cyan transition-colors">{user.name}</h1>
              <h2 className="text-gray-400 text-xs mt-1">{user.designation}</h2>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
