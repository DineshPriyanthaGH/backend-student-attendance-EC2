# 🔐 GitHub Actions Environment Variables Setup Guide

## 📋 Variables to Add to GitHub Repository Secrets

You need to add these environment variables as **Repository Secrets** in GitHub:

### 🚀 Required Repository Secrets

| Secret Name | Value | Notes |
|-------------|-------|--------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `production` | Use production for deployment |
| `FIREBASE_PROJECT_ID` | `school-atendance-12089` | Your Firebase project ID |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\nMIIEvg...` | Full private key with \n characters |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@school-atendance-12089.iam.gserviceaccount.com` | Service account email |

## 🔧 How to Add Secrets to GitHub Repository

### Step 1: Navigate to Repository Settings
1. Go to your GitHub repository: `https://github.com/DineshPriyanthaGH/backend-school-managment-system`
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add Each Secret
Click **New repository secret** for each variable:

#### Secret 1: PORT
- **Name**: `PORT`
- **Value**: `3000`

#### Secret 2: NODE_ENV
- **Name**: `NODE_ENV`  
- **Value**: `production`

#### Secret 3: FIREBASE_PROJECT_ID
- **Name**: `FIREBASE_PROJECT_ID`
- **Value**: `school-atendance-12089`

#### Secret 4: FIREBASE_PRIVATE_KEY
- **Name**: `FIREBASE_PRIVATE_KEY`
- **Value**: 
```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCnowW/CSexMuzk
CZ8fIu7aBOoSdJaoCOgqsm1z6fBm/ca0uaoJKirXsOOqrP/dpSi54aRQu6LiUOPV
PoSbCVxWJyDFxZ5GcPEM1SM+D/bvtMU6hYkPEoFO2Iu9AJO1kRp7FWDYEinXLC3R
43enQ0WBWr82gyD6kAkhOB8S8KWl1Xzqy3SSWY66nd2hzVVcOELD9IUGoFSQJJF0
ZHUEsWJjz4IUPslS5ZoG4ycQxiej5VPususzHYeYxbRMJBRFczUccaN7yz5g6nuN
2qleweoH07/JTynLnRcTXvSN0FnDS5/rTrNNBQYWHbaxsksGUe3RfVBEBM1k45CV
amS+W1YlAgMBAAECggEACDcfTDgq4457GQbWrzwzR+h3Py3LB1Oeax9A6W4Uy7tS
nl8988KHBHiFA8OEK4zRRODHwHQdnKk5rSTp8z4fchJrUv3nDo0w5v/YAQ3fvGoX
w1ExgRVXVHGc0YeidYK1sUQAMb6cIdEmsrNK1R3hHWCA3+9HsbfW1rOtJCy6dXi/
TeGIO0kGsI4cUO9up0vfhY5M+rz+u9WACLBVuw3Ca1xcSeXRoZQXVW6dhaiCBPBw
YaLsQO4nbegwKgWKkOPtTB/2xl9ZBrq67CWC43h/DKFpsGrn9CA1L1cZC595tQb/
AluMEoM6cqJPABFoE4qkE4MfnJZhGZ5KeYJVNtxhWQKBgQDgxh2wjyNCwjFJNWgF
h8sH6miRVQONY6KAHY/wgl0vFIijXy+DxgBWssivZu/gACvf31IDcD4nmsxd67V9
QhOcVpnCHVQIa2rbp5hlgxVLcVDgOapFbSFZInCI6coALmjY5/ZghjYxCjjNUP2S
n1anDEetbucaseTpSICpbmVxTQKBgQC+7OBzV+aIGmU3lKXoVN93CNPJDBoo7bhM
liXs1b5QHUITWnGbuOBUAWQj/SD4rHnC9t080hWHAQNvRLy8Zr/ExGNBsDxQrLmo
y/DXW6I3USYg1cJQeDdJ1/Xcv2wrbkqSxs2ExKv2oldcU1eroiCCo2XPLDyhJNNT
Pr2OV4uMOQKBgQDay77GyO5343P6YUQ6be6Sa/kRzwFANkZOE3izkxKF66T98n/b
83cM7ccwBjFliIUszMOWmUHHZ4Wbvv/RR+qy+hF9xPKxp25DFqbf2XN3Fny1Zyx5
nDsj+sQ0Ye7BsmtZCKLpXnuNzPdx1G6gtP2yad+z0QqhD51V/79OLioM2QKBgQCW
NbUs6iYkRGgHv3p7/HJHq3k8PrpCIy0RjDvQRiXR0AMRSOIC+wP685E+w0LygnfV
jPVoiXyIV6LFItY+f7Q2cbAJmUcKzanQBIu6U4yfasfNo3+aYcpV3YPAphXLYZ1o
NuKwpy8H/pcuux9JmGdtgHJz+UDGIzvjzYPC/lt6+QKBgBTvsIdarMNdz5m8phHE
uixV44eD1wLMuQ3Che5SI5LGT0otDSvVyWuTUWzCucFrh9SCZvLaYWIopTNMN9TZ
r9N24HGpj4oKdjjTnm/Tz1fogXKqNudywPDCXpjQUB0PRW+rDPTK7QP7S3oXqH0w
SVsObMH6uOUPtYC7HlpRU8d0
-----END PRIVATE KEY-----
```
⚠️ **Important**: Paste the private key **without quotes** and with actual line breaks (not \n)

#### Secret 5: FIREBASE_CLIENT_EMAIL
- **Name**: `FIREBASE_CLIENT_EMAIL`
- **Value**: `firebase-adminsdk-fbsvc@school-atendance-12089.iam.gserviceaccount.com`

## 🚨 Critical Notes for Private Key

### For FIREBASE_PRIVATE_KEY Secret:
- **Remove the outer quotes** when pasting into GitHub secrets
- **Replace `\n` with actual line breaks**
- The secret should look like this in GitHub:

```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCnowW/CSexMuzk
CZ8fIu7aBOoSdJaoCOgqsm1z6fBm/ca0uaoJKirXsOOqrP/dpSi54aRQu6LiUOPV
...rest of the key...
-----END PRIVATE KEY-----
```

**NOT like this:**
```
"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCnowW/CSexMuzk\nCZ8fIu7aBOoSdJaoCOgqsm1z6fBm/ca0uaoJKirXsOOqrP/dpSi54aRQu6LiUOPV\n...
```

## 🔄 Converting Your Private Key for GitHub

Your current `.env` format:
```bash
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvg..."
```

For GitHub Secrets, convert to:
```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCnowW/CSexMuzk
CZ8fIu7aBOoSdJaoCOgqsm1z6fBm/ca0uaoJKirXsOOqrP/dpSi54aRQu6LiUOPV
...
-----END PRIVATE KEY-----
```

## ✅ Verification Checklist

After adding all secrets, you should see these in your repository:
- ✅ PORT
- ✅ NODE_ENV  
- ✅ FIREBASE_PROJECT_ID
- ✅ FIREBASE_PRIVATE_KEY
- ✅ FIREBASE_CLIENT_EMAIL

## 🚀 Next Steps

1. **Add all secrets to GitHub** (as described above)
2. **Create GitHub Actions workflow** (I'll create this next)
3. **Test the workflow** by pushing to your repository

The secrets will be available in GitHub Actions workflows as:
- `${{ secrets.PORT }}`
- `${{ secrets.NODE_ENV }}`
- `${{ secrets.FIREBASE_PROJECT_ID }}`
- `${{ secrets.FIREBASE_PRIVATE_KEY }}`
- `${{ secrets.FIREBASE_CLIENT_EMAIL }}`

## 🔐 Security Benefits

✅ **Secrets are encrypted** and not visible in logs
✅ **Only accessible** during GitHub Actions execution  
✅ **No sensitive data** in your source code
✅ **Environment-specific** configuration
