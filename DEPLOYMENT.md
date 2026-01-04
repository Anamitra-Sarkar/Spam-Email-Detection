# Deployment Guide

This guide provides step-by-step instructions for deploying the Spam Email Detection application to production.

## Architecture

- **Frontend**: Vite/React application deployed on Vercel
- **Backend**: FastAPI application deployed on Render
- **Communication**: Frontend communicates with backend via REST API

## Prerequisites

1. A [Vercel](https://vercel.com/) account
2. A [Render](https://render.com/) account
3. GitHub repository with the code

## Backend Deployment (Render)

### Step 1: Create a New Web Service

1. Log in to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select the `Spam-Email-Detection` repository

### Step 2: Configure the Service

Use the following settings:

- **Name**: `spam-email-detection-backend` (or your preferred name)
- **Region**: Choose the region closest to your users
- **Branch**: `main` (or your production branch)
- **Root Directory**: Leave empty (root of repository)
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn backend_server:app --host 0.0.0.0 --port $PORT`

### Step 3: Set Environment Variables

In the Render dashboard, add the following environment variable:

- **Key**: `FRONTEND_URL`
- **Value**: `https://your-frontend-url.vercel.app` (you'll get this after deploying the frontend)

**Note**: After deploying the frontend, come back and update this value.

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for the deployment to complete
3. Note your backend URL (e.g., `https://spam-email-detection-backend.onrender.com`)

### Step 5: Test the Backend

Visit `https://your-backend-url.onrender.com/health` to verify the backend is running.

## Frontend Deployment (Vercel)

### Step 1: Import Project

1. Log in to your Vercel dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the `Spam-Email-Detection` repository

### Step 2: Configure the Project

Use the following settings:

- **Framework Preset**: Vite
- **Root Directory**: `frontend_vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Set Environment Variables

In the Vercel project settings, add the following environment variable:

- **Key**: `VITE_API_URL`
- **Value**: `https://your-backend-url.onrender.com` (from Step 4 of Backend Deployment)

**Important**: Do NOT include a trailing slash in the URL.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the deployment to complete
3. Note your frontend URL (e.g., `https://your-project.vercel.app`)

### Step 5: Update Backend CORS

1. Go back to your Render dashboard
2. Navigate to your backend service
3. Update the `FRONTEND_URL` environment variable with your Vercel URL
4. Render will automatically redeploy the backend

## Verification

### Test the Complete Flow

1. Visit your frontend URL
2. Try the spam detection feature:
   - Enter a test email
   - Click "Analyze Email"
   - Verify you get a response from the backend

### Common Test Emails

**Spam Example**:
```
Congratulations! You've won $1,000,000. Click here to claim your prize now!
```

**Safe Example**:
```
Hi John, let's schedule a meeting tomorrow at 2 PM to discuss the project updates.
```

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

1. Verify the `FRONTEND_URL` in Render matches your Vercel URL exactly
2. Ensure there are no trailing slashes
3. Check that both services have been redeployed after environment variable changes

### Backend Not Loading Models

If you see "Service temporarily unavailable":

1. Check the Render logs for errors
2. Ensure all required files (`outputs/` directory with models) are in the repository
3. Verify the build command completed successfully

### Frontend Cannot Connect to Backend

If the frontend shows connection errors:

1. Verify the `VITE_API_URL` in Vercel is set correctly
2. Test the backend health endpoint directly: `https://your-backend-url.onrender.com/health`
3. Check browser console for specific error messages

### Build Failures

**Frontend Build Issues**:
- Ensure all dependencies are listed in `package.json`
- Check Vercel build logs for specific errors
- Verify Node.js version compatibility

**Backend Build Issues**:
- Ensure all dependencies are listed in `requirements.txt`
- Check Render build logs for specific errors
- Verify Python version (3.11 recommended)

## Environment Variables Summary

### Frontend (Vercel)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://spam-email-detection-backend.onrender.com` |

### Backend (Render)
| Variable | Description | Example |
|----------|-------------|---------|
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-project.vercel.app` |
| `PORT` | Port number (auto-set by Render) | `10000` |

## Continuous Deployment

Both Vercel and Render support automatic deployments:

- **Vercel**: Automatically deploys when you push to your connected branch
- **Render**: Automatically deploys when you push to your connected branch

To trigger a manual deployment:
- **Vercel**: Go to project → Deployments → "Redeploy"
- **Render**: Go to service → Manual Deploy → "Deploy latest commit"

## Production Considerations

### Security
- Keep environment variables secure and never commit them to the repository
- Use HTTPS for all production URLs
- Review CORS settings periodically

### Performance
- Monitor response times in both Render and Vercel dashboards
- Consider upgrading to paid tiers for better performance
- Enable caching where appropriate

### Monitoring
- Set up alerts in Render for backend health
- Monitor Vercel analytics for frontend performance
- Check logs regularly for errors

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review service logs in Render/Vercel dashboards
3. Verify all environment variables are set correctly
4. Ensure both services are using the latest code from your repository

## Cost

### Free Tier Limitations

**Render (Free)**:
- Services spin down after inactivity
- First request may be slow (cold start)
- Limited build minutes

**Vercel (Free)**:
- Unlimited bandwidth
- 100 GB-hours compute time per month
- Automatic SSL

For production use, consider upgrading to paid tiers for better performance and reliability.
