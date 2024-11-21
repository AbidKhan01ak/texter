import React from 'react';
import CardMedia from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

function MediaSkeleton({ loading = false, image }) {
    return (
        <Box
            sx={{
                width: '100%',
                height: '400px',
                m: 2,
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1f1f1f',
            }}
        >
            {loading ? (
                <Skeleton
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.15)', // Lighter shimmer background
                        height: '100%',
                        width: '100%',
                    }}
                    animation="wave" // Enables shimmer effect
                    variant="rectangular" // Full rectangle skeleton
                />
            ) : (
                <CardMedia
                    component="img"
                    image={image?.src}
                    alt={image?.alt}
                    sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '8px',
                        objectFit: 'cover',
                    }}
                />
            )}
        </Box>
    );
}

export default MediaSkeleton;
