import { v4 as uuidv4 } from "uuid";

const generateOrderId = () => {
    const unique = uuidv4()
        .replace(/-/g, "")
        .substring(0, 8)
        .toUpperCase();

    return `ORD-${unique}`;
};

export default generateOrderId;