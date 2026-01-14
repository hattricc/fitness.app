import React, { useState, useCallback } from 'react';
import { ImageList, ImageListItem, Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

const CombateSagrado: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [scale, setScale] = useState<number>(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleOpen = (img: string) => {
        setSelectedImage(img);
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleClose = () => {
        setSelectedImage(null);
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const zoomIn = () => {
        setScale(prev => Math.min(prev + 0.2, 3));
    };

    const zoomOut = () => {
        setScale(prev => Math.max(prev - 0.2, 0.5));
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setScale(prev => Math.min(Math.max(prev + delta, 0.5), 3));
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - startPos.x,
                y: e.clientY - startPos.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const images = Array.from({ length: 4 }, (_, i) => 
        `/images/combate-sagrado/combate-sagrado-${String(i + 1).padStart(2, '0')}.png`
    );

    return (
        <>
            <ImageList cols={1}>
                {images.map((img, index) => (
                    <ImageListItem 
                        key={img} 
                        onClick={() => handleOpen(img)}
                        sx={{ 
                            cursor: 'pointer', 
                            '&:hover': { 
                                opacity: 0.9,
                                transform: 'scale(1.01)',
                                transition: 'transform 0.2s ease-in-out'
                            } 
                        }}
                    >
                        <img 
                            src={img} 
                            alt={`Combate Sagrado ${index + 1}`} 
                            loading="lazy"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </ImageListItem>
                ))}
            </ImageList>

            <Modal
                open={!!selectedImage}
                onClose={handleClose}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 'none',
                }}
            >
                <Box 
                    sx={{ 
                        position: 'relative',
                        width: '90%',
                        height: '90%',
                        outline: 'none',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0, 0, 0, 0.9)',
                    }}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {/* Zoom Controls */}
                    <Box sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        left: 16, 
                        display: 'flex', 
                        gap: 1,
                        zIndex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: 1,
                        p: 0.5
                    }}>
                        <IconButton 
                            onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                            sx={{ color: 'white' }}
                            title="Zoom In"
                        >
                            <ZoomInIcon />
                        </IconButton>
                        <IconButton 
                            onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                            sx={{ color: 'white' }}
                            title="Zoom Out"
                        >
                            <ZoomOutIcon />
                        </IconButton>
                    </Box>

                    {/* Close Button */}
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            top: 16,
                            color: 'white',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            },
                            zIndex: 1,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Image with zoom and pan */}
                    <Box
                        sx={{
                            transform: `scale(${scale})`,
                            transformOrigin: 'center',
                            transition: 'transform 0.1s ease-out',
                            position: 'relative',
                            cursor: scale > 1 ? 'grab' : 'default',
                            '&:active': {
                                cursor: scale > 1 ? 'grabbing' : 'default',
                            }
                        }}
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        }}
                    >
                        <img
                            src={selectedImage || ''}
                            alt=""
                            style={{ 
                                maxWidth: '100%',
                                maxHeight: '90vh',
                                display: 'block',
                                pointerEvents: 'none',
                            }}
                        />
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default CombateSagrado;