# Glimmer

## Download and Installation
- Releases are currently exclusively via github releases
- Software tested with Windows and Linux
- Available as a Squirrel Installer, as well as Deb and RPM packages
- [Releases] (https://github.com/NikolaPi/glimmer/releases/)

## Configuration
### Config File Info
- Config folder varies depending on operating system. Depending on OS configuration this could vary, but the general locations will be
	- On Windows: %AppData%/glimmer/config
	- On Linux: ~/.config/glimmer/config
- Default config files will be created if no config is present
- Restart is necessary for configuration changes to take effect

## Config Setup
Use google sheet to create config files

## Usage
- **WARNING:** This application does not autosave. To save, you must enter the cues menu, then click on the save icon and select the output file
- To load file, click on box labeled 'select file' and select the file
- Fixture colors do not update until the first change. Therefore the color must be changed or re-entered (in the case of the full, blackout, or white shorcuts) before recording the cue
- Selected Fixtures are orange
- To edit info about a cue, type 'e' to enter edit mode, or click the three lines with a pen next to them. Then click on the property you would like to edit
- To record cue, use 'r', '0', or click on the three lines with the plus next to them
- Cue numbers can be decimals, if clicked on (particularly useful for reordering cues to be before cue 1). Cues are always in numerical order, so ensure that cues are given proper numbering.

### Keyboard Shortcuts

### General Shorcuts
| Key Combination | Action |
| :-: | :-: |
| CTRL + w | Close Application |

#### Color Picker Shortcuts (make sure numlock is on, or use top row numbers)
| 7: sat- | 8: int+ | 9: sat+ |
| :-: | :-: | :-: |
| 4: hue+ | 5: record | 6: hue- |
| 1: BLACKOUT | 2: int- | 3: FULL |
| 0: sat=0 | | |

#### Main Menu Shortcuts
| Key | Mneumonic | Action |
| :-: | :-: | --- |
| a | (a)ll | Select all fixtures |
| z | (z)ero | Deselect all fixtures |
| r | (r)ecord | Record a cue |
| h | (h)ide | Toggle hidden mode |
| f | (f)lush | If in hidden mode, show programming on live rig |
| e | (e)dit | Open cue view - editor mode |
| p | (p)lay | Open cue view - player mode |

#### Edit / Play Mode Shortcuts
| Key | Mneumonic | Action |
| :-: | :-: | --- |
| [SPACE] | n/a | Next Cue (will loop back)
| x | e(x)it | Exits back to main menu
