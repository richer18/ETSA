import os
import subprocess
from datetime import datetime

# Define the folders
folders = [
    r"C:\xampp\htdocs\ETSA",
    r"C:\xampp\htdocs\ETSA\frontend"
]

# Function to run git commands
def run_git_commands(folder):
    print(f"\nProcessing folder: {folder}")

    os.chdir(folder)  # Change directory

    # Add all changes
    subprocess.run(["git", "add", "."], check=True)

    # Commit with current timestamp
    commit_message = f"Auto-commit on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    subprocess.run(["git", "commit", "-m", commit_message], check=True)

    # Push to origin
    subprocess.run(["git", "push", "origin", "main"], check=True)  # Change 'main' to 'master' if needed

    print(f"✅ Successfully pushed: {folder}")

# Run the process for both folders
for folder in folders:
    try:
        run_git_commands(folder)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error in {folder}: {e}")

print("\n🚀 All done!")
