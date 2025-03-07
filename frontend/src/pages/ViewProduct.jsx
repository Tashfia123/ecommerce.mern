import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addReplyToReview } from '../redux/userSlice';
import styled from 'styled-components';
import { BasicButton } from '../utils/buttonStyles';
import { getProductDetails } from '../redux/userHandle';
import { Avatar, Card, Button, TextField, Typography } from '@mui/material';
import { generateRandomColor, timeAgo } from '../utils/helperFunctions';

const ViewProduct = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const productID = params.id;

    const { currentUser, currentRole, productDetails, loading, responseDetails } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getProductDetails(productID));
    }, [productID, dispatch]);

    const [reply, setReply] = useState('');
    const [replyToReviewId, setReplyToReviewId] = useState(null);

    const handleReplySubmit = () => {
        if (replyToReviewId && reply.trim()) {
            dispatch(addReplyToReview({ reviewId: replyToReviewId, reply }));
            setReply('');
            setReplyToReviewId(null);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    // If productDetails is not available or has missing data, show an error or a fallback UI
    if (responseDetails || !productDetails) {
        return <div>Product not found</div>;
    }

    const { productName, price, description, reviews, productImage } = productDetails || {};

    return (
        <ProductContainer>
            <ProductImage src={productImage} alt={productName} />
            <ProductInfo>
                <ProductName>{productName}</ProductName>
                <PriceContainer>
                    {/* Use optional chaining to avoid accessing properties of undefined */}
                    <PriceCost>৳{price?.cost || 'N/A'}</PriceCost>
                    <PriceMrp>৳{price?.mrp || 'N/A'}</PriceMrp>
                    <PriceDiscount>{price?.discountPercent ? `${price.discountPercent}% off` : 'No discount'}</PriceDiscount>
                </PriceContainer>
                <Description>{description || 'No description available'}</Description>
            </ProductInfo>

            {currentRole === 'Customer' && (
                <ButtonContainer>
                    <BasicButton onClick={() => dispatch(addToCart(productDetails))}>Add to Cart</BasicButton>
                </ButtonContainer>
            )}

            <ReviewWritingContainer>
                <Typography variant="h4">Reviews</Typography>
            </ReviewWritingContainer>

            {reviews && reviews.length > 0 ? (
                <ReviewContainer>
                    {reviews.map((review, index) => (
                        <ReviewCard key={index}>
                            <ReviewCardDivision>
                                <Avatar sx={{ width: '60px', height: '60px', marginRight: '1rem', backgroundColor: generateRandomColor(review._id) }}>
                                    {String(review.reviewer.name).charAt(0)}
                                </Avatar>
                                <ReviewDetails>
                                    <Typography variant="h6">{review.reviewer.name}</Typography>
                                    <Typography variant="body2">{timeAgo(review.date)}</Typography>
                                    <Typography variant="subtitle1">Rating: {review.rating}</Typography>
                                    <Typography variant="body1">{review.comment}</Typography>

                                    {currentRole === 'Seller' && (
                                        <Button onClick={() => setReplyToReviewId(review._id)} variant="outlined" color="primary">
                                            Reply
                                        </Button>
                                    )}

                                    {replyToReviewId === review._id && (
                                        <div>
                                            <TextField
                                                fullWidth
                                                label="Write a reply"
                                                value={reply}
                                                onChange={(e) => setReply(e.target.value)}
                                            />
                                            <Button onClick={handleReplySubmit} variant="contained" color="secondary">
                                                Submit Reply
                                            </Button>
                                        </div>
                                    )}
                                </ReviewDetails>
                            </ReviewCardDivision>
                        </ReviewCard>
                    ))}
                </ReviewContainer>
            ) : (
                <ReviewWritingContainer>
                    <Typography variant="h6">No Reviews Found. Add a review.</Typography>
                </ReviewWritingContainer>
            )}
        </ProductContainer>
    );
};

export default ViewProduct;

const ProductContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px;
    justify-content: center;
    align-items: center;
    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const ProductImage = styled.img`
    max-width: 300px;
    margin-bottom: 20px;
`;

const ProductInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const ProductName = styled.h1`
    font-size: 24px;
`;

const PriceContainer = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;
`;

const PriceMrp = styled.p`
    margin-top: 8px;
    text-decoration: line-through;
    color: #525050;
`;

const PriceCost = styled.h3`
    margin-top: 8px;
`;

const PriceDiscount = styled.p`
    margin-top: 8px;
    color: darkgreen;
`;

const Description = styled.p`
    margin-top: 16px;
`;

const ButtonContainer = styled.div`
    margin: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ReviewWritingContainer = styled.div`
    margin: 6rem;
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const ReviewContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
`;

const ReviewCard = styled(Card)`
    background-color: white;
    margin-bottom: 2rem;
    padding: 1rem;
`;

const ReviewCardDivision = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
`;

const ReviewDetails = styled.div`
    flex: 1;
`;
