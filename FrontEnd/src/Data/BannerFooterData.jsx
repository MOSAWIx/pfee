import { LiaShippingFastSolid } from "react-icons/lia";
import { TbArrowBack } from "react-icons/tb";
import { LuCreditCard } from "react-icons/lu";
import { MdFavoriteBorder } from "react-icons/md";
// Data: BannerFooter Data
export const BannerFooterData = [
    {
        id:1,
        icon: <MdFavoriteBorder className="text-[24px]" />,
        title:"ماركاتك المفضلة في مكان واحد",
        description:"ماركات مختارة بعناية لتناسب ذوقك واطلالاتك المختلفة"
    },
    {
        id:2,
        icon: <LuCreditCard className="text-[24px]" />,
        title:"تسوقي بأمان بطرق دفع مختلفة",
        description:"ابل باي, بطاقة الائتمان, تابي, تمارا, او دفع عند الاستلام"
    },
    {
        id:3,
        icon: <TbArrowBack className="text-[24px]" />,
        title:"تسوقي بسهولة",
        description:"إرجاع مجاني للطلبات خلال 3 أيام من عملية الشراء",
    },
    {
        id:4,
        icon: <LiaShippingFastSolid className="text-[24px]" />,
        title:"شحن مجاني",
        description:"استمتعي بشحن مجاني للطلبات أكثر من 199 ريال"
    }
]
