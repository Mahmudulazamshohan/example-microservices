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
} from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';

interface SharePostModalProps {
  open: boolean;
  onClose: () => void;
}

const style = {
  position: 'absolute' as const,
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
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
      <Card sx={style}>
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
            rows={4} // Number of visible rows
            variant="outlined" // You can use 'filled' or 'standard' as well
            placeholder="Enter your text here"
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
