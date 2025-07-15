'use client'
import { Button } from "@/shared/components";
import { Box, TextField, Typography, useTheme } from "@mui/material"
export const RatingManagementFormReply = ({replyText, setReplyText, handleAddReply}: {replyText: string, setReplyText: (replyText: string) => void; handleAddReply: () => void}) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Box sx={{
                backgroundColor: theme.palette.primary.light,
                py: 2,
                textAlign: 'center',
                color: theme.palette.text.secondary,
                fontWeight: theme.typography.fontWeightBold
            }}>
                <Typography variant='body2'>
                    Trả lời bình luận
                </Typography>
            </Box>
            
            <Box
                style={{
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                }}
            >
                
                <Box sx={{backgroundColor: theme.palette.secondary.dark}}>
                    <TextField
                        rows={15}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        multiline
                        sx={{
                            width: '100%'
                        }}
                        placeholder='Nhập tin nhắn...'
                    />
                </Box>
                <Box sx={{ pt: 0.5 }}>
                    <Button 
                        name='Phản hồi'
                        handleOnClick={handleAddReply}
                    />
                </Box>
            </Box>
        </Box>
    )
}