# BodyDiagram Component - Usage Guide

## Overview
The `BodyDiagram` component provides a visual SVG body diagram for injection site selection with intelligent rotation suggestions.

## Features
- ✅ SVG body silhouette with 8 injection sites
- ✅ Visual indicators for selected, suggested, and recently used sites
- ✅ Intelligent rotation logic to prevent overuse of the same sites
- ✅ Button grid for easy site selection
- ✅ Legend explaining visual indicators
- ✅ Haptic feedback on site selection
- ✅ Full theme support via `useShotsyColors`

## Props Interface

```typescript
export interface BodyDiagramProps {
  selectedSites: string[];       // Currently selected injection sites
  onSiteToggle: (siteId: string) => void;  // Callback when site is toggled
  history?: string[];             // Past injection sites for rotation logic
}
```

## Available Injection Sites

The component supports 8 injection sites:

1. `stomach_left` - Abdômen Esquerdo 🫃
2. `stomach_right` - Abdômen Direito 🫃
3. `thigh_left` - Coxa Esquerda 🦵
4. `thigh_right` - Coxa Direita 🦵
5. `arm_left` - Braço Esquerdo 💪
6. `arm_right` - Braço Direito 💪
7. `buttock_left` - Glúteo Esquerdo 🍑
8. `buttock_right` - Glúteo Direito 🍑

## Rotation Logic

The component implements intelligent site rotation:

1. **Recently Used Sites** (last 3): Shown with dimmed appearance and 🕐 indicator
2. **Suggested Sites**: Highlighted with green border and 💡 indicator
3. **Rotation Pattern**: Stomach → Thighs → Arms → Buttocks → repeat

### Algorithm:
- Tracks last 3 injection sites from history
- Suggests sites that haven't been used recently
- Follows body area rotation pattern
- If all sites recently used, suggests least recent

## Visual Indicators

| Indicator | Meaning | Appearance |
|-----------|---------|------------|
| Filled circle with border | Selected site | Blue/Primary color |
| Dashed green ring + 💡 | Suggested next site | Green outline |
| Dimmed + 🕐 | Recently used | Low opacity |

## Basic Usage

```typescript
import { BodyDiagram } from '@/components/application/BodyDiagram';

function MyComponent() {
  const [selectedSites, setSelectedSites] = useState<string[]>([]);

  const handleSiteToggle = (siteId: string) => {
    setSelectedSites(prev =>
      prev.includes(siteId)
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  };

  return (
    <BodyDiagram
      selectedSites={selectedSites}
      onSiteToggle={handleSiteToggle}
    />
  );
}
```

## Usage with History (Rotation Logic)

```typescript
import { BodyDiagram } from '@/components/application/BodyDiagram';
import { useApplications } from '@/hooks/useApplications';

function AddApplicationScreen() {
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const { applications } = useApplications();

  // Extract injection site history from past applications
  const injectionHistory = applications
    .sort((a, b) => b.date.getTime() - a.date.getTime()) // Most recent first
    .flatMap(app => app.injection_sites)
    .slice(0, 10); // Last 10 injection sites

  const handleSiteToggle = (siteId: string) => {
    setSelectedSites(prev =>
      prev.includes(siteId)
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  };

  return (
    <BodyDiagram
      selectedSites={selectedSites}
      onSiteToggle={handleSiteToggle}
      history={injectionHistory}
    />
  );
}
```

## Integration with add-application.tsx

Replace the existing `InjectionSiteGrid` with `BodyDiagram`:

```typescript
// Before:
<ExpandableSection
  title="Local da Injeção"
  value={data.injectionSites.length ? `${data.injectionSites.length} selecionado(s)` : undefined}
  defaultExpanded={data.injectionSites.length === 0}
>
  <InjectionSiteGrid
    value={data.injectionSites}
    onChange={(sites) => setData({ ...data, injectionSites: sites })}
  />
</ExpandableSection>

// After:
<ExpandableSection
  title="Local da Injeção"
  value={data.injectionSites.length ? `${data.injectionSites.length} selecionado(s)` : undefined}
  defaultExpanded={data.injectionSites.length === 0}
>
  <BodyDiagram
    selectedSites={data.injectionSites}
    onSiteToggle={(siteId) => {
      const newSites = data.injectionSites.includes(siteId)
        ? data.injectionSites.filter(id => id !== siteId)
        : [...data.injectionSites, siteId];
      setData({ ...data, injectionSites: newSites });
    }}
    history={applications
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .flatMap(app => app.injection_sites)
      .slice(0, 10)
    }
  />
</ExpandableSection>
```

## Component Structure

```
BodyDiagram/
├── SVG Body Silhouette
│   ├── Head (circle)
│   ├── Torso (ellipse)
│   ├── Arms (ellipses)
│   └── Legs (ellipses)
│
├── Injection Site Markers (8 circles)
│   ├── Visual state indicators
│   ├── Clickable touch areas
│   └── Status badges
│
├── Legend
│   ├── Selected indicator
│   ├── Suggested indicator
│   └── Recently used indicator
│
├── Button Grid (8 buttons)
│   ├── Icon + label for each site
│   ├── Status badges (💡/🕐)
│   └── Visual state styling
│
└── Rotation Tip (conditional)
    └── Shown when suggestion available
```

## Styling & Theming

The component uses `useShotsyColors` hook for full theme support:

- `colors.primary` - Selected sites
- `colors.success` - Suggested sites
- `colors.textMuted` - Recently used sites
- `colors.border` - Default site markers
- `colors.background` - Component backgrounds
- Auto-adapts to light/dark mode

## Accessibility

- Large touch targets (48x48pt minimum)
- Clear visual feedback
- Haptic feedback on interaction
- Text labels for all sites
- Color + icon indicators (not relying on color alone)

## Performance

- Lightweight SVG rendering
- Optimized re-renders
- Minimal state updates
- No heavy computations

## Future Enhancements

Potential improvements:

1. Animation on site selection
2. Custom site recommendations based on BMI
3. Pain/irritation tracking per site
4. 3D body rotation
5. Photo upload for injection site tracking
6. Multi-language support for labels
7. Export injection history as PDF/image

## Troubleshooting

### Sites not showing
- Verify `react-native-svg` is installed (v15.12.1+)
- Check SVG viewBox coordinates
- Ensure parent has sufficient height

### Rotation not working
- Pass valid `history` array
- Check site IDs match exactly
- Verify history contains recent data

### Styling issues
- Confirm `useShotsyColors` hook available
- Check theme context is provided
- Verify StyleSheet is not being overridden

## Testing

```typescript
// Test rotation logic
const history = ['stomach_left', 'stomach_right', 'thigh_left'];
// Expected suggestion: thigh_right or arm_left

// Test selection
onSiteToggle('stomach_left');
// Should toggle site in selectedSites array

// Test visual states
isSelected('stomach_left'); // true/false
isSuggested('thigh_right'); // true/false
isRecentlyUsed('stomach_left'); // true/false
```

## Dependencies

- `react-native-svg` (v15.12.1)
- `expo-haptics` (v15.0.7)
- `@/hooks/useShotsyColors`
- `@/components/application/*` (for integration)
