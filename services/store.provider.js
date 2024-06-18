import { BaseError } from "../config/error.js";
import { status } from "../config/response.status.js";
import { previewReviewResponseDTO } from "../dtos/store.dto.js";
import { getPreviewReview } from "../models/store.dao.js";

export const getReview = async (storeId, query) => {
    try {
        const { reviewId, size = 3 } = query;
        const reviews = await getPreviewReview(reviewId, size, storeId);
        return previewReviewResponseDTO(reviews);
    } catch (error) {
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }
}
