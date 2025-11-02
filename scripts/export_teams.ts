import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { utils, writeFile } from 'xlsx';

const prisma = new PrismaClient();

// Helper function to escape CSV values
function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('\"') || value.includes('\n')) {
    // Escape double quotes by doubling them
    value = value.replace(/\"/g, '\"\"');
    // Wrap in quotes
    value = `\"${value}\"`;
  }
  return value;
}

async function exportTeams(format: 'csv' | 'xlsx' = 'csv') {
  try {
    // Fetch all teams with related data
    const teams = await prisma.team.findMany({
      include: {
        registeredBy: true,
        Event: true,
        TeamMembers: true // Include all team members, regardless of verification status
      }
    });

    // Group teams by college and then by sport
    const groupedTeams: Record<string, Record<string, typeof teams>> = {};

    teams.forEach(team => {
      const collegeName = team.registeredBy.collegeName;
      const sportName = team.Event.name;

      if (!groupedTeams[collegeName]) {
        groupedTeams[collegeName] = {};
      }

      if (!groupedTeams[collegeName][sportName]) {
        groupedTeams[collegeName][sportName] = [];
      }

      groupedTeams[collegeName][sportName].push(team);
    });

    if (format === 'csv') {
      // Create CSV content
      let csvContent = 'College Name,Sport,Team ID,Player Name\n';

      // Sort colleges alphabetically
      const sortedColleges = Object.keys(groupedTeams).sort();

      for (const college of sortedColleges) {
        // Sort sports alphabetically within each college
        const sortedSports = Object.keys(groupedTeams[college]).sort();

        for (const sport of sortedSports) {
          const teamsInSport = groupedTeams[college][sport];

          for (const team of teamsInSport) {
            // Add a row for each team member
            if (team.TeamMembers.length > 0) {
              for (const member of team.TeamMembers) {
                csvContent += `${escapeCSVValue(college)},${escapeCSVValue(sport)},${escapeCSVValue(team.id)},${escapeCSVValue(member.name)}\n`;
              }
            } else {
              // Add a row with empty player name if no members
              csvContent += `${escapeCSVValue(college)},${escapeCSVValue(sport)},${escapeCSVValue(team.id)},\n`;
            }
          }
        }
      }

      // Write the CSV file
      const fileName = `teams_export_${new Date().toISOString().slice(0, 10)}.csv`;
      const filePath = path.join(process.cwd(), fileName);
      fs.writeFileSync(filePath, csvContent);

      console.log(`Teams exported successfully to ${filePath} in CSV format`);
    } else if (format === 'xlsx') {
      // Prepare data for Excel
      const excelData = [];
      excelData.push(['College Name', 'Sport', 'Team ID', 'Player Name']);

      // Sort colleges alphabetically
      const sortedColleges = Object.keys(groupedTeams).sort();

      for (const college of sortedColleges) {
        // Sort sports alphabetically within each college
        const sortedSports = Object.keys(groupedTeams[college]).sort();

        for (const sport of sortedSports) {
          const teamsInSport = groupedTeams[college][sport];

          for (const team of teamsInSport) {
            // Add a row for each team member
            if (team.TeamMembers.length > 0) {
              for (const member of team.TeamMembers) {
                excelData.push([college, sport, team.id, member.name]);
              }
            } else {
              // Add a row with empty player name if no members
              excelData.push([college, sport, team.id, '']);
            }
          }
        }
      }

      // Create worksheet and workbook
      const worksheet = utils.aoa_to_sheet(excelData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Teams');

      // Write the Excel file
      const fileName = `teams_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
      const filePath = path.join(process.cwd(), fileName);
      writeFile(workbook, filePath);

      console.log(`Teams exported successfully to ${filePath} in Excel format`);
    }

    console.log(`Total teams exported: ${teams.length}`);
    console.log(`Colleges represented: ${Object.keys(groupedTeams).length}`);
    
  } catch (error) {
    console.error('Error exporting teams:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Determine export format from command line arguments
const formatArg = process.argv[2];
let format: 'csv' | 'xlsx' = 'csv';

if (formatArg === 'xlsx') {
  format = 'xlsx';
} else if (formatArg === 'csv') {
  format = 'csv';
} else {
  console.log('No format specified, defaulting to CSV. Use \"xlsx\" argument to export to Excel format.');
}

// Run the export function
exportTeams(format);