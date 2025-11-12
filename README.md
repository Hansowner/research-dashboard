# Research Synthesis Dashboard

A production-ready, hierarchical dashboard for visualizing and exploring research insights with full traceability from strategic themes down to verbatim user quotes.

## 🎯 Features

- **4-Level Hierarchy**: Themes → Clusters → Entities → Raw Quotes
- **Visual Hierarchy**: Clear size relationships, typography scales, and color coding
- **Progressive Disclosure**: Navigate deeper into data without overwhelming the user
- **Trust Through Traceability**: Every insight traces back to original source data
- **Edit Mode**: Add, edit, and delete themes directly in the interface
- **Fully Responsive**: Works beautifully on desktop, tablet, and mobile
- **Production Ready**: Built with Vite, React, TypeScript, and Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm (installed automatically if not present)

### Installation

```bash
# Navigate to the project directory
cd research-dashboard

# Install dependencies (if not already done)
pnpm install

# Start the development server
pnpm dev
```

The dashboard will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the production bundle
pnpm build

# Preview the production build
pnpm preview
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service.

## 📝 Editing Research Data

### Method 1: Using the Edit Mode (Theme Level Only)

1. Click the **"Edit Mode"** button in the top-right corner
2. Hover over any theme card to see Edit and Delete buttons
3. Click **Edit** to modify theme title, description, color, and sources
4. Click **Add New Theme** at the bottom to create a new theme
5. Click **"Exit Edit Mode"** when done

**Note**: The Edit Mode UI currently only edits theme-level data. To add/edit clusters and entities, use Method 2.

### Method 2: Editing the JSON File (Full Control)

For complete control over all data (themes, clusters, entities, quotes), edit the data file directly:

**File location**: `src/data/research-data.json`

#### Data Structure

```json
{
  "themes": [
    {
      "id": "t1",                          // Unique ID
      "title": "Theme title",              // Large, bold statement
      "description": "Theme description",   // 2-3 sentences of context
      "sources": ["Source 1", "Source 2"], // Data source badges
      "clusterCount": 6,                   // Number of clusters
      "color": "blue",                     // Theme accent color (blue, green, amber, purple, rose, cyan)
      "clusters": [
        {
          "id": "c1",                      // Unique ID
          "name": "Cluster name",          // Cluster title
          "summary": "Cluster summary",    // 1-2 sentences
          "entityCount": 8,                // Number of entities
          "entities": [
            {
              "id": "e1",                  // Unique ID
              "statement": "The JTBD or insight statement",
              "type": "jtbd",              // Type: jtbd, fact, pain, or gain
              "pains": ["Pain 1", "Pain 2"], // Optional array
              "gains": ["Gain 1", "Gain 2"], // Optional array
              "source": "Interview #47",   // Source label
              "transcriptId": "T-032",     // Transcript ID
              "participantId": "P-23",     // Participant ID
              "timestamp": "31:42",        // Quote timestamp
              "date": "Nov 8, 2024",       // Interview date
              "verbatimQuote": "The actual user quote...",
              "context": "Question that was asked..."
            }
          ]
        }
      ]
    }
  ]
}
```

## 🏗️ Project Structure

```
research-dashboard/
├── src/
│   ├── components/
│   │   ├── ResearchDashboard.tsx    # Main dashboard component
│   │   ├── ThemeCard.tsx            # Level 1: Theme cards
│   │   ├── ClusterCard.tsx          # Level 2: Cluster cards
│   │   ├── EntityItem.tsx           # Level 3: Entity list items
│   │   ├── SourceModal.tsx          # Level 4: Raw quote modal
│   │   ├── Breadcrumb.tsx           # Navigation breadcrumb
│   │   ├── EditThemeDialog.tsx      # Edit theme dialog
│   │   ├── theme-provider.tsx       # Theme context provider
│   │   └── ui/                      # shadcn/ui components
│   ├── data/
│   │   └── research-data.json       # ⭐ EDIT THIS FILE FOR YOUR DATA
│   ├── App.tsx                      # Root component
│   ├── types.ts                     # TypeScript interfaces
│   └── index.css                    # Global styles
├── package.json
└── README.md
```

## 📊 Data Guidelines

### Recommended Limits

- **Themes**: 3-6 per dashboard (optimal for visual hierarchy)
- **Clusters per Theme**: 3-8 (fits well in 3-column grid)
- **Entities per Cluster**: 5-20 (scrollable list)
- **Quote Length**: Keep under 200 words for readability

## 🚢 Deployment

### Static Hosting (Recommended)

1. Build the project: `pnpm build`
2. Deploy the `dist/` folder to:
   - **Netlify**: Drag and drop the `dist` folder
   - **Vercel**: `vercel deploy`
   - **GitHub Pages**: Copy to `docs/` and enable Pages
   - **Cloudflare Pages**: Connect your repo
   - **AWS S3**: Upload `dist` contents to bucket

## 🆘 Troubleshooting

### Dashboard won't load
- Check browser console for errors
- Verify `research-data.json` is valid JSON
- Run `pnpm dev` and check terminal output

### Edit mode not working
- Ensure you clicked "Edit Mode" button
- Check that theme has valid data structure
- Look for console errors

### Data not updating
- Hard refresh (Cmd/Ctrl + Shift + R)
- Clear browser cache
- Check that JSON file saved properly

## 📄 License

This project is licensed under the MIT License.

## 🙏 Credits

Built with:
- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
