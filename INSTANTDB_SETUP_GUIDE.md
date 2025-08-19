# InstantDB Schema Setup Guide

## ✅ Updated Implementation

I've updated our code to use the proper [InstantDB Storage API](https://www.instantdb.com/docs/storage):

- ✅ **Fixed storage uploads**: Now using `db.storage.uploadFile()` which returns file metadata with URLs
- ✅ **Fixed queries**: Using proper InstantDB query syntax with ordering and limits  
- ✅ **Created schema files**: `instant.schema.ts` and `instant.perms.ts`
- ✅ **Built-in file storage**: Using InstantDB's `$files` entity for automatic file management

## 🚀 Two Ways to Set Up Your Schema

### Option 1: Using InstantDB CLI (Recommended)

1. **Login to InstantDB CLI:**
```bash
npx instant-cli@latest login
```

2. **Push schema and permissions:**
```bash
npx instant-cli@latest push
```

This will automatically create your `submissions` collection with all the proper fields and permissions!

### Option 2: Manual Dashboard Setup

If you prefer to set up manually in your InstantDB dashboard:

#### 1. Go to your InstantDB Dashboard
- Visit [instantdb.com](https://instantdb.com)
- Sign in and select your **QR-STORE** app

#### 2. Create the `submissions` Entity
Go to the **Schema** section and create a new entity called `submissions` with these fields:

| Field Name | Type | Indexed | Optional |
|------------|------|---------|----------|
| `timestamp` | string | ✅ | ❌ |
| `purchaseLocation` | string | ✅ | ❌ |
| `npsScore` | number | ✅ | ❌ |
| `feedbackDetail` | string | ❌ | ❌ |
| `skinConcern` | string | ✅ | ❌ |
| `emailAddress` | string | ✅ | ❌ |
| `joinedLoyalty` | boolean | ✅ | ❌ |
| `beforeUrl` | string | ❌ | ✅ |
| `afterUrl` | string | ❌ | ✅ |
| `createdAt` | number | ✅ | ❌ |

#### 3. Set Up Permissions
Go to the **Permissions** section and add these rules:

**For `$files` (file storage):**
```json
{
  "$files": {
    "allow": {
      "view": "true",
      "create": "true",
      "delete": "false"
    }
  }
}
```

**For `submissions` (form data):**
```json
{
  "submissions": {
    "allow": {
      "view": "true", 
      "create": "true",
      "update": "false",
      "delete": "false"
    }
  }
}
```

## 🔧 What Changed in Our Implementation

### Storage API Update
- **Before:** Used incorrect `db.storage.upload()` with manual URL generation
- **After:** Using `db.storage.uploadFile()` which returns proper file metadata with URLs

### Query Improvements  
- **Before:** Manual sorting and limiting in JavaScript
- **After:** Using InstantDB's native ordering and limit in queries

### Built-in File Management
- **Before:** Custom file URL handling
- **After:** InstantDB automatically manages files in `$files` entity with public URLs

## 🎯 Benefits of This Setup

1. **Automatic File URLs**: InstantDB handles secure, optimized file serving
2. **Real-time Updates**: All data changes sync in real-time
3. **Built-in Security**: Proper permissions for uploads and data access
4. **Optimized Queries**: Server-side sorting and limiting
5. **Type Safety**: Full TypeScript support with proper schema

## 🧪 Testing Your Setup

Once you've set up the schema, test it by:

1. **Deploy to Vercel** with your InstantDB environment variables
2. **Submit a form** with before/after photos
3. **Check your InstantDB dashboard** - you should see:
   - New entries in the `submissions` collection
   - Uploaded files in the `$files` collection
4. **Visit the admin page** - submissions should display correctly

The storage system now follows InstantDB best practices and will provide better performance and reliability! 🚀
