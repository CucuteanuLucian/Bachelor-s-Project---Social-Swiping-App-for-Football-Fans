import { useEffect, useState, useRef } from 'react';
import { useGesture } from '@use-gesture/react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Avatar, Stack, Container, Typography, Box } from '@mui/material';
import api from '../../api';


function ClosestUsers() {
    const username = localStorage.getItem('username');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await api.get(`api/get-users-for/${username}/`);
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setTimeout(() => setLoading(false), 1000); // asteapta o sec
            }
        };

        if (username) fetchUserDetails();
    }, [username]);

    const handleSwipe = async (user, direction) => {
        console.log(`Swiped ${direction} on`, user.name);
        
        const payload = {
            user_from: username,
            user_to: user.username,
            swipe_type: direction === "right" ? "dislike" : "like",
        };
    
        try {
            const response = await api.post(`api/swipe-create/`, payload);
            console.log('Swipe Creat:', response.data);
        } catch (error) {
            console.error('Eroare la trimiterea datelor:', error);
        }
    
        setUsers(prevUsers => prevUsers.filter(u => u.username !== user.username));
    };


    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {loading ? (
                <Typography variant="h5" color="textSecondary">
                    Se încarcă utilizatorii... ⏳
                </Typography>
            ) : users.length === 0 ? (
                <Typography variant="h5" color="textSecondary">
                    Nu mai sunt oameni disponibili! 🎉
                </Typography>
            ) : (
                <Box sx={{ position: 'relative', width: '300px', height: '500px' }}>
                    {users.map((user, index) => (
                        <SwipeCard
                            key={user.username}
                            user={user}
                            onSwipe={handleSwipe}
                            zIndex={users.length - index}
                        />
                    ))}
                </Box>
            )}
        </Container>
    );
}


function SwipeCard({ user, onSwipe, zIndex }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-20, 20]);
    const cardRef = useRef();

    const bind = useGesture({
        onDrag: ({ down, movement: [mx], last }) => {
            const maxDragDistance = 150;
            const minSwipeThreshold = 100;
    
            const limitedX = Math.max(-maxDragDistance, Math.min(mx, maxDragDistance));
    
            if (!down && last) {
                if (Math.abs(limitedX) > minSwipeThreshold) {
                    const direction = limitedX > 0 ? 'right' : 'left';
                    animate(x, direction === 'right' ? 400 : -400, {
                        duration: 0.3,
                        ease: "easeOut",
                        onComplete: () => {
                            onSwipe(user, direction);
                            x.set(0);
                        }
                    });
                } else {
                    animate(x, 0, {
                        duration: 0.2,
                        ease: "easeOut"
                    });
                }
            } else {
                x.set(limitedX);
            }
        }
    });

    return (
        <motion.div
            ref={cardRef}
            {...bind()}
            style={{
                x,
                rotate,
                touchAction: 'none',
                zIndex,
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '20px',
                backgroundColor: 'pink',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Stack spacing={2} alignItems="center">
                <Avatar
                    src={"http://localhost:8000/api" + user.profile_picture}
                    alt={user.username}
                    sx={{ width: 100, height: 100 }}
                />
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body2">Lat: {user.latitude}</Typography>
                <Typography variant="body2">Lng: {user.longitude}</Typography>
            </Stack>
        </motion.div>
    );
}

export default ClosestUsers;
