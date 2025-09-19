import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { YouTubeHelper } from '../../../data/youtube-helper';
import { ModalBoxStyles, ModalCloseButtonStyles, ModalStyles, ModalVideoBoxStyles, ModalVideoStyles } from './styles';

interface YouTubeModalProps {
  open: boolean;
  url: string | null;
  onClose: () => void;
  title?: string;
}

const YouTubeModal: React.FC<YouTubeModalProps> = ({ open, url, onClose, title = 'Exercise Video' }) => {
  const embedUrl = url ? YouTubeHelper.getEmbedUrl(url, true) : '';
  console.log(embedUrl)

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="video-modal-title"
      aria-describedby="video-modal-description"
      sx={ModalStyles}
    >
      <Box sx={ModalBoxStyles}>
        <IconButton onClick={onClose} sx={ModalCloseButtonStyles} aria-label="close">
          <CloseIcon />
        </IconButton>

        <Box sx={ModalVideoBoxStyles}>
          {embedUrl && (
            <iframe
              allowFullScreen
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={ModalVideoStyles}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default YouTubeModal;
