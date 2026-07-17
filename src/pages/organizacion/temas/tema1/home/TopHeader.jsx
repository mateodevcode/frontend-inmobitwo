import { IoIosMail } from "react-icons/io";
import { RiPhoneFill } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { GrFacebookOption } from "react-icons/gr";
import { FaInstagram } from "react-icons/fa6";

const TopHeader = () => {
  return (
    <div className="bg-rose-50 h-12 flex items-center justify-center w-full font-poppins">
      <div className="flex items-center justify-between w-10/12">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <IoIosMail className="text-rose-600" />
            <p className="text-black/80 text-xs hover:text-rose-600 transition duration-300 cursor-pointer select-none">
              infomailexample@gmail.com
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RiPhoneFill className="text-rose-600" />
            <p className="text-black/80 text-xs hover:text-rose-600 transition duration-300 cursor-pointer select-none">
              + 00 (123) 456 789 00
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <FaWhatsapp className="text-black" />
            <GrFacebookOption className="text-black" />
            <FaInstagram className="text-black" />
          </div>
          <div className="w-px h-5 bg-black/20" />
          <div className="flex items-center gap-1">
            <p className="text-black/80 text-xs cursor-pointer select-none">
              English
            </p>
            <MdOutlineKeyboardArrowDown className="text-black/80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
