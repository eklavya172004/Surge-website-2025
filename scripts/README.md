# Team Export Scripts

These scripts allow you to export team information from the database, sorted by college and sport.

## Scripts

### `export_teams.ts`
Exports team data to CSV format by default, but can also export to Excel format.

**Usage:**
- CSV format (default): `npm run export-teams`
- Excel format: `npm run export-teams xlsx`

### `export_teams_excel.ts`
Exports team data specifically to Excel format.

**Usage:**
- Excel format: `npm run export-teams-excel`

## Data Structure

The exported files will contain these columns:
- College Name: Name of the college the team belongs to
- Sport: Name of the sport/event
- Team ID: Unique identifier for the team
- Player Name: Name of the team member
- Player Email: Email address of the team member
- Player Phone: Phone number of the team member

## Notes

- Only verified team members are included in the export
- Teams are sorted first by college name alphabetically, then by sport name alphabetically
- The export includes all required information in an easily readable format