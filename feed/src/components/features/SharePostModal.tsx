import * as React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  Card,
  Avatar,
  IconButton,
  TextField,
  Theme,
  SxProps,
} from '@mui/material';
import CloseOutlined from '@mui/icons-material/CloseOutlined';

interface SharePostModalProps {
  open: boolean;
  onClose: () => void;
}

const modalSx: SxProps<Theme> = {
  position: 'absolute' as const,
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%', // 90% width on extra-small screens
    sm: '80%', // 80% width on small screens
    md: '60%', // 60% width on medium screens
    lg: '50%', // 50% width on large screens
    xl: '40%', // 40% width on extra-large screens
  },
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const SharePostModal: React.FC<SharePostModalProps> = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card sx={{ ...modalSx }}>
        <Box sx={{ p: 2, gap: 1 }}>
          <Box
            display={'flex'}
            marginBottom={1}
            justifyContent={'space-between'}
          >
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <Avatar src="https://media.licdn.com/dms/image/D5603AQEm02djvZLyQw/profile-displayphoto-shrink_100_100/0/1707895378353?e=1729123200&v=beta&t=Nka-YlabpB2XchYXp3dGIp63JvrglkO1u8SaAiiUGUY" />
              <Typography>Mahmudul Azam</Typography>
            </Box>
            <Box>
              <IconButton onClick={onClose}>
                <CloseOutlined />
              </IconButton>
            </Box>
          </Box>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            placeholder="Share a post, write someting here"
            fullWidth
          />
        </Box>
        <Divider />
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Post
          </Button>
        </Box>
      </Card>
    </Modal>
  );
};

export default SharePostModal;
