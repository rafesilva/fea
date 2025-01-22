export const getWidthForSize = (size: string): number => {
    switch (size) {
        case "small":
            return 33.33;
        case "medium":
            return 50;
        case "large":
            return 66.66;
        default:
            return 100;
    }
};

export const capitalizeFirstLetter = (str: string) => {
    if (!str) {
        return "";
    }
    return str.replace(/^./, (first) => first.toUpperCase());
}