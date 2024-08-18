import * as React from 'react';
import { useState } from 'react';
import { FC } from 'react';
import { Avatar, Box, Button, Card, TextField } from '@mui/material';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import SharePostModal from './SharePostModal';

const SharePost: FC = () => {
  const [showPost, setShowPost] = useState<boolean>(false);

  const onClose = () => {
    setShowPost(false);
  };

  const handleModal = () => setShowPost(true);
  return (
    <>
      <SharePostModal open={showPost} onClose={onClose} />
      <Box marginBottom={3} marginTop={3}>
        <Card elevation={0}>
          <Box padding={3}>
            <Box display={'flex'} gap={1}>
              <Avatar src="https://media.licdn.com/dms/image/D5603AQEm02djvZLyQw/profile-displayphoto-shrink_100_100/0/1707895378353?e=1729123200&v=beta&t=Nka-YlabpB2XchYXp3dGIp63JvrglkO1u8SaAiiUGUY" />
              <TextField
                placeholder="Share a post, write someting here"
                size="medium"
                fullWidth
                multiline
                rows={2}
                style={{ background: '#eee' }}
                onClick={handleModal}
              />
            </Box>
            <Box display={'flex'} marginTop={3}>
              <Button
                component="label"
                role={undefined}
                variant="text"
                tabIndex={-1}
                startIcon={<PermMediaIcon color="info" />}
              >
                Media
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default SharePost;
