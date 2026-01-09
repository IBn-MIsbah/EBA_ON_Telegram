import React from "react";

import ImageNot from "../components/images/404.png";
import { CornerUpLeft } from "lucide-react";

const Not: React.FC = () => {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-[#f1e6c9] p-4">
        {/* Added -translate-y-[20px] below */}
        <div className="max-w-md rounded-xl bg-[#f1e6c9] p- transition-all md:max-w-lg lg:max-w-xl text-center -translate-y-[20px]">
          <div className="">
            <img src={ImageNot} className="" alt="" />

            <h2 className="text-4xl md:text-5xl font-medium pb-4">
              Oops! Page not found
            </h2>
            <p className="text-xs md:sm text-gray-500 pb-4">
              {" "}
              The page you are looking for doesn't exist or has been moved.
              Please check the URL or return to the dashboard.
            </p>
          </div>
          <button className=" bg-[#6465F0]  px-8 py-1 rounded-md hover:opacity-90 cursor-pointer">
            <div className="flex items-center  gap-5">
              <CornerUpLeft
                size={18}
                strokeWidth={2.5}
                className="text-white"
              />
              <p className="text-white ">Back </p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Not;
