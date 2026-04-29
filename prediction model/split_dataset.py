import pandas as pd
import os

def split_dataset(file_path, output_dir):
    print(f"Reading {file_path}...")
    df = pd.read_csv(file_path)
    
    # Create the output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")
    
    # Get unique person IDs
    person_ids = df['person_ID'].unique()
    print(f"Found {len(person_ids)} unique persons.")
    
    # Split and save
    for pid in person_ids:
        person_df = df[df['person_ID'] == pid]
        output_file = os.path.join(output_dir, f"{pid}.csv")
        person_df.to_csv(output_file, index=False)
        print(f"Saved {output_file} (Rows: {len(person_df)})")

if __name__ == "__main__":
    input_file = "pain_dataset_200P_4hz.csv"
    output_folder = "person_data"
    split_dataset(input_file, output_folder)
    print("\nSplitting complete!")
