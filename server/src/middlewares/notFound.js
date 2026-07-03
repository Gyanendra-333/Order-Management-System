import ApiResponse from "../utils/ApiResponse.js";

const notFound = (req, res) => {

    return res.status(404).json(

        new ApiResponse(
            false,
            "Route Not Found",
            null
        )

    );

};

export default notFound;