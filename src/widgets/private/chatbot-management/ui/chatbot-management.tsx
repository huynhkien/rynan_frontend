import { Box, Typography, useTheme, TextField, IconButton, Paper, Avatar, Chip} from "@mui/material"
import { Send, Person, AttachFile, Circle} from "@mui/icons-material"
import { useState } from "react"
import Image from "next/image";
import { chatbot } from "@/features/user/api/userApis";
import DOMPurify from 'dompurify';

// Định nghĩa type cho message
interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: string;
}

export const ChatbotManagement = () => {
    const theme = useTheme();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: 'Xin chào tôi là chatbot. Tôi có thể hỗ trợ gì cho bạn?',
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Helper function đơn giản để chuẩn hóa message
    const sanitizeMessage = (text: string) => {
        // Nếu có HTML tags thì sanitize, không thì giữ nguyên
        if (/<[^>]*>/g.test(text)) {
            return DOMPurify.sanitize(text);
        }
        return text;
    };

    const handleSendMessage = async () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: messages.length + 1,
                text: message,
                sender: "user",
                timestamp: new Date().toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })
            };
            
            // Thêm message của user
            setMessages(prev => [...prev, newMessage]);
            const currentMessage = message;
            setMessage("");
            setIsLoading(true);
            
            try {
                // Thêm delay để tạo cảm giác tự nhiên (1-2 giây)
                const minLoadingTime = 1500; // 1.5 giây
                const startTime = Date.now();
                
                const response = await chatbot(currentMessage);
                
                // Tính toán thời gian còn lại để đảm bảo loading tối thiểu
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
                
                // Chờ thêm thời gian nếu cần
                if (remainingTime > 0) {
                    await new Promise(resolve => setTimeout(resolve, remainingTime));
                }
                
                // Thêm response từ bot
                const botResponse: Message = {
                    id: messages.length + 2,
                    text: response.data,
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })
                };
                
                setMessages(prev => [...prev, botResponse]);
            } catch (error) {
                console.error('Chatbot API error:', error);
                
                // Vẫn giữ delay ngay cả khi có lỗi
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Hiển thị lỗi cho user
                const errorResponse: Message = {
                    id: messages.length + 2,
                    text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })
                };
                
                setMessages(prev => [...prev, errorResponse]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleQuickAction = (quickMessage: string) => {
        setMessage(quickMessage);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Component cho typing indicator với animation
    const TypingIndicator = () => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: theme.palette.text.secondary
                }}>
                    <Image src='/logo/chatbot-logo.png' alt='logo' width={20} height={20}/>
                </Avatar>
                <Paper sx={{
                    p: 2,
                    bgcolor: theme.palette.grey[100],
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <Typography variant='body1' sx={{ fontStyle: 'italic' }}>
                        Đang soạn tin nhắn
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[0, 1, 2].map((index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: theme.palette.primary.main,
                                    opacity: 0.4,
                                    animation: 'typing 1.4s infinite',
                                    animationDelay: `${index * 0.2}s`,
                                    '@keyframes typing': {
                                        '0%, 60%, 100%': {
                                            opacity: 0.4,
                                            transform: 'scale(1)'
                                        },
                                        '30%': {
                                            opacity: 1,
                                            transform: 'scale(1.2)'
                                        }
                                    }
                                }}
                            />
                        ))}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
            {/* Header */}
            <Box sx={{ 
                backgroundColor: theme.palette.primary.main, 
                py: 1,
                pl: 2,
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
                                fontSize: 12,
                                animation: isLoading ? 'pulse 1s infinite' : 'none',
                                '@keyframes pulse': {
                                    '0%': { opacity: 1 },
                                    '50%': { opacity: 0.5 },
                                    '100%': { opacity: 1 }
                                }
                            }} />
                            <Typography variant='caption' sx={{ 
                                color: theme.palette.primary.contrastText,
                                opacity: 0.8
                            }}>
                                {isLoading ? 'Đang xử lý...' : 'Đang hoạt động'}
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
                            mb: 2,
                            animation: 'fadeIn 0.3s ease-in',
                            '@keyframes fadeIn': {
                                from: { opacity: 0, transform: 'translateY(10px)' },
                                to: { opacity: 1, transform: 'translateY(0)' }
                            }
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
                                {msg.sender === 'user' ? (
                                    <Person />
                                ) : (
                                    <Image 
                                        src='/logo/chatbot-logo.png' 
                                        alt='logo' 
                                        width={20} 
                                        height={20}
                                    />
                                )}
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
                                {/* Render message đơn giản */}
                                {/<[^>]*>/g.test(msg.text) ? (
                                    // Nếu có HTML thì render HTML
                                    <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(msg.text) }} />
                                ) : (
                                    // Nếu không thì render text thường
                                    <Typography 
                                        variant='body1'
                                        sx={{ 
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {msg.text}
                                    </Typography>
                                )}
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
                
                {/* Loading indicator với animation */}
                {isLoading && <TypingIndicator />}
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
                        disabled={isLoading}
                        onClick={() => handleQuickAction("Sản phẩm nào bán chạy nhất?")}
                    />
                    <Chip 
                        label="Tồn kho sản phẩm" 
                        variant="outlined" 
                        size="small" 
                        clickable
                        disabled={isLoading}
                        onClick={() => handleQuickAction("Kiểm tra tồn kho sản phẩm")}
                    />
                    <Chip 
                        label="Khách hàng mới" 
                        variant="outlined" 
                        size="small" 
                        clickable
                        disabled={isLoading}
                        onClick={() => handleQuickAction("Thống kê khách hàng đăng ký mới")}
                    />
                    <Chip 
                        label="Liên hệ hỗ trợ" 
                        variant="outlined" 
                        size="small" 
                        clickable
                        disabled={isLoading}
                        onClick={() => handleQuickAction("Tôi cần hỗ trợ từ nhân viên")}
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
                    <IconButton size="small" color="primary" disabled={isLoading}>
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
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
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
                        disabled={!message.trim() || isLoading}
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