'use client';

import React, { useRef, useState } from 'react';
import {
  Box,
  IconButton,
  Avatar,
  Button,
  Stack,
  TextField,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import { InputImageProps } from '@/types/components/input.types';

export const InputImage = ({ onImageChange }: InputImageProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onImageChange?.(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Stack spacing={1} alignItems="center">
      <Box position="relative" width={100} height={100}>
        {/* TextField được làm ẩn nhưng vẫn trigger file */}
        <TextField
          type="file"
          inputRef={fileInputRef}
          onChange={handleFileChange}
          inputProps={{
            accept: 'image/*',
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
              zIndex: 2,
            },
          }}
          sx={{
            position: 'absolute',
            width: 100,
            height: 100,
            p: 0,
            zIndex: 2,
            '& .MuiOutlinedInput-root': {
              border: 'none',
              padding: 0,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
        />

        {preview ? (
          <Avatar
            src={preview}
            alt="preview"
            sx={{
              width: 120,
              height: 120,
              borderRadius: 2,
              border: '2px solid #ccc',
            }}
            onClick={handleClick}
          />
        ) : (
          <IconButton
            onClick={handleClick}
            sx={{
              width: 100,
              height: 100,
              border: '2px dashed #ccc',
              borderRadius: 2,
              zIndex: 1,
            }}
          >
            <PhotoCameraIcon />
          </IconButton>
        )}

        {/* Nút xóa ảnh */}
        {preview && (
          <IconButton
            size="small"
            onClick={handleRemoveImage}
            sx={{
              position: 'absolute',
              top: -8,
              right: -20,
              bgcolor: 'white',
              border: '1px solid #ccc',
              zIndex: 3,
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {!preview && (
        <Button onClick={handleClick} variant="outlined" size="small">
          Tải ảnh lên
        </Button>
      )}
    </Stack>
  );
};

