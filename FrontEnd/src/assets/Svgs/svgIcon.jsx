import { IconData } from "./iconData";
import { useMemo } from "react";


const SvgIcon = ({ name }) => {
    const iconData = useMemo(
        () => IconData.find((icon) => icon?.name === name),
        [name]
    );

    if (!iconData) {
        console.warn(`Icon with name "${name}" not found.`);
        return null;
    }

    return iconData?.icon;

}

export default SvgIcon;