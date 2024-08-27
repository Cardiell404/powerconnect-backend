import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

export const LoginLimiter: RateLimitRequestHandler  = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: req => {
    return req.ip || 'unknown-ip';
  },
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many login attempts from this IP, please try again after 15 minutes'
    });
  }
});
