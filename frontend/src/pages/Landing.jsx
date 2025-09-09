import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';

export default function Landing() {
  return (
    <Box sx={{ color: 'white', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Container maxWidth="100vw" sx={{ py: 6, textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 800, 
            mb: 3,
            background: 'linear-gradient(45deg, #3b82f6, #6366f1, #a855f7)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Streamline Your Orders, Grow Your Business
        </Typography>
        <Typography variant="h5" sx={{ mb: 6, color: 'rgba(255,255,255,0.8)', maxWidth: '800px', mx: 'auto' }}>
          A smart Order Management System that simplifies sales, tracks inventory, and keeps your customers happy — all in one place.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
          <Button 
            variant="contained" 
            size="large"
            component={Link}
            to="/customers"
            sx={{ 
              px: 4, 
              py: 2, 
              background: 'linear-gradient(45deg, #3b82f6, #6366f1)',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 600
            }}
          >
            🚀 Get Started Free
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            sx={{ 
              px: 4, 
              py: 2, 
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            📖 Book a Demo
          </Button>
        </Stack>
      </Container>

      {/* Key Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}>
          Everything You Need to Manage Orders Efficiently
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            {
              icon: '📦',
              title: 'Centralized Order Tracking',
              desc: 'Track all orders from multiple  sales channels in real-time.'
            },
            {
              icon: '📊',
              title: 'Smart Dashboard',
              desc: 'Get insights on sales, pending shipments, overdue orders, and customer trends.'
            },
            {
              icon: '🚚',
              title: 'Shipment Management',
              desc: 'Monitor pending, completed, and overdue shipments with status updates.'
            },
            {
              icon: '🔄',
              title: 'Automated Workflows',
              desc: 'Reduce manual errors with automatic order updates, invoicing, and notifications.'
            },
            {
              icon: '👤',
              title: 'Customer Management',
              desc: 'Store customer details, view order history, and improve service quality.'
            },
            {
              icon: '📈',
              title: 'Reports & Analytics',
              desc: 'Generate detailed reports on order volume, revenue, and inventory health.'
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ height: '100%' }}>
                <Paper
                  elevation={0}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    p: 3,
                    height: '250px',
                    width: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'flex-start',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)'
                    }
                  }}
                >
                  <Typography variant="h3" sx={{ mb: 2 }}>{feature.icon}</Typography>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>{feature.title}</Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, flex: 1 }}>
                    {feature.desc}
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700,color: 'wihte' }}>
          Why Businesses Choose Our OMS
        </Typography>
        <Grid container spacing={3}>
          {[
            'Save time with automated order processing',
            'Reduce costly inventory and shipping errors',
            'Provide better customer service with accurate tracking',
            'Scale your business with multi-channel integrations'
          ].map((benefit, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Stack direction="row" spacing={3} alignItems="flex-start">
                <Box sx={{ color: '#4ade80', fontSize: '1.5rem' }}>✅</Box>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>{benefit}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 2, fontWeight: 700 }}>
          Simple, Fast, and Reliable
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 6, color: 'rgba(255,255,255,0.8)' }}>
          How It Works
        </Typography>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {[
            {
              step: '1',
              title: 'Import Orders',
              desc: 'Sync from e-commerce, POS, or manual entry'
            },
            {
              step: '2',
              title: 'Manage & Track',
              desc: 'Update order status, assign shipments'
            },
            {
              step: '3',
              title: 'Deliver Smarter',
              desc: 'Automate invoices, track shipments, notify customers'
            },
          ].map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Chip
                  label={step.step}
                  sx={{
                    mb: 2,
                    width: 60,
                    height: 60,
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #3b82f6, #6366f1)',
                    color: 'white'
                  }}
                />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>{step.title}</Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {step.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}>
          Trusted by Businesses Everywhere
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            {
              quote: "This system cut our order errors in half and improved delivery times!",
              author: "Rajesh, Retail Owner"
            },
            {
              quote: "We can now handle 3x more orders with the same team. It's a game changer!",
              author: "Priya, E-commerce Founder"
            }
          ].map((testimonial, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                p: 4,
                width: '400px',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: '0 0 auto'
              }}
            >
              <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', fontSize: '1.1rem' }}>
                "{testimonial.quote}"
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                – {testimonial.author}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* Pricing Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}>
          Simple & Transparent Pricing
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            {
              plan: 'Starter Plan',
              desc: 'For small businesses just starting out'
            },
            {
              plan: 'Growth Plan',
              desc: 'For mid-sized businesses managing volume'
            },
            {
              plan: 'Enterprise Plan',
              desc: 'Custom solutions for large-scale operations'
            }
          ].map((pricing, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                p: 4,
                textAlign: 'center',
                width: '300px',
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: '0 0 auto'
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>{pricing.plan}</Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {pricing.desc}
              </Typography>
            </Paper>
          ))}
        </Box>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '2rem' }}>
            👉 All plans include free setup, training, and support.
          </Typography>
        </Box>
      </Container>

      {/* Final CTA Section */}
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 6, fontWeight: 700 }}>
          Ready to Take Control of Your Orders?
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
          <Button 
            variant="contained" 
            size="large"
            component={Link}
            to="/customers"
            sx={{ 
              px: 4, 
              py: 2, 
              background: 'linear-gradient(45deg, #3b82f6, #6366f1)',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 600
            }}
          >
            🚀 Start Free Trial
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            sx={{ 
              px: 4, 
              py: 2, 
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            📞 Contact Sales
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

