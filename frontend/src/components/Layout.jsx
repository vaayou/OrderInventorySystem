import { Link, Outlet, useLocation } from "react-router-dom";
import { 
	Tooltip, 
	AppBar, 
	Toolbar, 
	Typography, 
	Box, 
	Container, 
	Grid, 
	Paper, 
	Stack,
	Chip
} from "@mui/material";

const navLinks = [
	{
		to: "/customers",
		label: "Customers",
		icon: null,
	},
	{
		to: "/inventory",
		label: "Inventory",
		icon: null,
	},
	
	{
		to: "/products",
		label: "Products",
		icon: null,
	},
	{
		to: "/shipments",
		label: "Shipments",
		icon: null,
	},
	{
		to: "/stores",
		label: "Stores",
		icon: null,
	},
];

export default function Layout() {
	const location = useLocation();
	return (
		<Box 
			sx={{ 
				minHeight: '100vh', 
				display: 'flex', 
				width: '100%',
				flexDirection: 'column',
				background: 'linear-gradient(135deg, #0f172a 0%, #312e81 50%, #0f172a 100%)'
			}}
		>
			{/* Futuristic top accent bar */}
			<Box 
				sx={{ 
					height: '4px', 
					width: '100%', 
					background: 'linear-gradient(90deg, #3b82f6, #6366f1, #a855f7)',
					opacity: 0.8
				}} 
			/>
			<AppBar 
				position="sticky" 
				sx={{ 
					backgroundColor: 'rgba(255, 255, 255, 0.1)',
					backdropFilter: 'blur(20px)',
					borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
					boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
				}}
			>
				<Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
					<Typography 
						variant="h4" 
						component={Link}
						to="/"
						sx={{ 
							fontWeight: 800, 
							color: 'white', 
							textShadow: '0 4px 8px rgba(0,0,0,0.3)',
							letterSpacing: '0.5px',
							textDecoration: 'none',
							cursor: 'pointer',
							transition: 'all 0.3s ease',
							'&:hover': {
								transform: 'scale(1.02)',
								textShadow: '0 6px 12px rgba(59, 130, 246, 0.4)'
							}
						}}
					>
						Order Inventory System
					</Typography>
					<Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
						{navLinks.map((link) => {
							const isActive = location.pathname.startsWith(link.to);
							return (
								<Tooltip
									title={link.label}
									arrow
									key={link.to}
									placement="bottom"
								>
									<Box
										component={Link}
										to={link.to}
										sx={{
											textDecoration: 'none',
											display: 'inline-block'
										}}
									>
										<Chip
											label={link.label}
											variant={isActive ? "filled" : "outlined"}
											sx={{
												backgroundColor: isActive 
													? 'linear-gradient(45deg, #3b82f6, #6366f1, #a855f7)'
													: 'rgba(255, 255, 255, 0.05)',
												color: 'white',
												border: isActive 
													? '1px solid rgba(59, 130, 246, 0.5)'
													: '1px solid rgba(255, 255, 255, 0.2)',
												fontSize: '0.75rem',
												fontWeight: 'bold',
												textTransform: 'uppercase',
												letterSpacing: '0.5px',
												transition: 'all 0.3s ease',
												'&:hover': {
													backgroundColor: isActive 
														? 'rgba(59, 130, 246, 0.8)'
														: 'rgba(255, 255, 255, 0.1)',
													transform: 'translateY(-2px)',
													boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
												},
												...(isActive && {
													background: 'linear-gradient(45deg, #3b82f6, #6366f1, #a855f7)',
													boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
												})
											}}
										/>
									</Box>
								</Tooltip>
							);
						})}
					</Stack>
				</Toolbar>
			</AppBar>
			<Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
				<Grid container spacing={10} sx={{ width: '100%' }}>
					{/* Main content area */}
					<Grid size={12}>
						<Paper
							elevation={0}
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								backdropFilter: 'blur(20px)',
								borderRadius: '24px',
								border: '1px solid rgba(255, 255, 255, 0.1)',
								boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
								p: 4,
								minHeight: '30vh',
								color: 'white'
							}}
						>
							<Outlet />
						</Paper>
					</Grid>
					
					
				</Grid>
			</Container>
			
			<Box 
				component="footer" 
				sx={{ 
					textAlign: 'center', 
					color: 'rgba(255, 255, 255, 0.4)', 
					fontSize: '0.75rem', 
					py: 3 
				}}
			>
				&copy; {new Date().getFullYear()} Order Inventory System &mdash; Futuristic UI with React, Material UI, and Tailwind CSS.
				<br />
				<span>
					<p style={{ fontSize: '1rem' }}>Created by Pawan Raj</p>
					Find me on
					{' '}
					<a
						href="https://github.com/vaayou"
						target="_blank"
						rel="noopener noreferrer"
						style={{
							color: '#60a5fa',
							textDecoration: 'none',
							fontWeight: 600,
							fontSize: '1rem'
						}}
						onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
						onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
					>
						GitHub
					</a>
					{'  |  '}
					<a
						href="https://www.linkedin.com/in/vaayou/"
						target="_blank"
						rel="noopener noreferrer"
						style={{
							color: '#a78bfa',
							textDecoration: 'none',
							fontWeight: 600,
							fontSize: '1rem'
						}}
						onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
						onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
					>
						LinkedIn
					</a>
				</span>
			</Box>
		</Box>
	);
}
