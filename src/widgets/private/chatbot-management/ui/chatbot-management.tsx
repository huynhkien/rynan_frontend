import { Box, Typography, useTheme, TextField, IconButton, Paper, Avatar, Chip} from "@mui/material"
import { Send, Person, AttachFile, Circle} from "@mui/icons-material"
import { useState } from "react"
import Image from "next/image";

export const ChatbotManagement = () => {
    const theme = useTheme();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Xin chào! Tôi là chatbot hỗ trợ. Tôi có thể giúp gì cho bạn?",
            sender: "bot",
            timestamp: "09:30"
        },
        {
            id: 2,
            text: "Tôi cần hỗ trợ về sản phẩm",
            sender: "user",
            timestamp: "09:32"
        },
        {
            id: 3,
            text: "Tôi sẽ giúp bạn về vấn đề sản phẩm. Bạn có thể mô tả cụ thể vấn đề mà bạn đang gặp phải không?",
            sender: "bot",
            timestamp: "09:32"
        }
    ]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: message,
                sender: "user",
                timestamp: new Date().toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })
            };
            setMessages([...messages, newMessage]);
            setMessage("");
            
            // Simulate bot response
            setTimeout(() => {
                const botResponse = {
                    id: messages.length + 2,
                    text: "Cảm ơn bạn đã liên hệ. Tôi đang xử lý yêu cầu của bạn...",
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })
                };
                setMessages(prev => [...prev, botResponse]);
            }, 1000);
        }
    };

   

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
            {/* Header */}
            <Box sx={{ 
                backgroundColor: theme.palette.primary.main, 
                py: 1,
                pl:2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 1
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ 
                        bgcolor: theme.palette.text.secondary,
                        color: theme.palette.primary.contrastText 
                    }}>
                        <Image
                            src='/logo/chatbot-logo.png'
                            alt='logo'
                            width={30}
                            height={30}
                        />
                    </Avatar>
                    <Box>
                        <Typography variant='body2' sx={{ 
                            color: theme.palette.primary.contrastText,
                            fontWeight: 600
                        }}>
                            Chatbot Hỗ Trợ
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Circle sx={{ 
                                color: '#4caf50', 
                                fontSize: 12 
                            }} />
                            <Typography variant='caption' sx={{ 
                                color: theme.palette.primary.contrastText,
                                opacity: 0.8
                            }}>
                                Đang hoạt động
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Body */}
            <Box sx={{ 
                flex: 1, 
                overflow: 'auto',
                backgroundColor: theme.palette.background.default,
                p: 2
            }}>
                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        sx={{
                            display: 'flex',
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            mb: 2
                        }}
                    >
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-end',
                            gap: 1,
                            maxWidth: '70%',
                            flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                        }}>
                            <Avatar sx={{ 
                                width: 32, 
                                height: 32,
                                bgcolor: msg.sender === 'user' 
                                    ? theme.palette.primary.main 
                                    : theme.palette.text.secondary
                            }}>
                                {msg.sender === 'user' ? <Person /> : <Image src='/logo/chatbot-logo.png' alt='logo' width={30} height={30}/>}
                            </Avatar>
                            <Paper
                                sx={{
                                    p: 2,
                                    bgcolor: msg.sender === 'user' 
                                        ? theme.palette.primary.main 
                                        : theme.palette.grey[100],
                                    color: msg.sender === 'user' 
                                        ? theme.palette.primary.contrastText 
                                        : theme.palette.text.primary,
                                    borderRadius: 2,
                                    maxWidth: '100%'
                                }}
                            >
                                <Typography variant='body1'>
                                    {msg.text}
                                </Typography>
                                <Typography 
                                    variant='caption' 
                                    sx={{ 
                                        opacity: 0.7,
                                        display: 'block',
                                        mt: 0.5
                                    }}
                                >
                                    {msg.timestamp}
                                </Typography>
                            </Paper>
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* Quick Actions */}
            <Box sx={{ 
                px: 2, 
                py: 1,
                backgroundColor: theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`
            }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                        label="Sản phẩm bán chạy" 
                        variant="outlined" 
                        size="small" 
                        clickable
                        onClick={() => setMessage("Tôi cần hỗ trợ kỹ thuật")}
                    />
                    <Chip 
                        label="Khách hàng đăng ký mới" 
                        variant="outlined" 
                        size="small" 
                        clickable
                        onClick={() => setMessage("Tôi muốn biết thông tin sản phẩm")}
                    />
                    <Chip 
                        label="Liên hệ nhân viên" 
                        variant="outlined" 
                        size="small" 
                        clickable
                        onClick={() => setMessage("Tôi muốn liên hệ với nhân viên")}
                    />
                </Box>
            </Box>

            {/* Message Input */}
            <Box sx={{ 
                p: 2, 
                backgroundColor: theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`
            }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                    <IconButton size="small" color="primary">
                        <AttachFile />
                    </IconButton>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        variant="outlined"
                        placeholder="Nhập tin nhắn..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                backgroundColor: theme.palette.background.default
                            }
                        }}
                    />
                    <IconButton 
                        color="primary" 
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        sx={{ 
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            '&:hover': {
                                bgcolor: theme.palette.primary.dark
                            },
                            '&:disabled': {
                                bgcolor: theme.palette.action.disabledBackground
                            }
                        }}
                    >
                        <Send />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    )
}