import { response } from "../config/response.js";
import { status } from "../config/response.status.js";

export const tempTest = (req, res, next) => {
    res.send(response(status.SUCCESS, getTempData()));
};

export const reviewPreview = async (req, res, next) => {
    return res.send(response(status.SUCCESS, await getReview(req.params.storeId, req.query)));
}