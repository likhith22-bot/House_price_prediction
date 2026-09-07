import pandas as pd
import numpy as np
import os

def generate_hyderabad_data():
    locations = {
        'Gachibowli': {'price_sqft': 8500, 'growth': 0.12, 'demand': 0.9, 'metro_dist': 1.5},
        'Kukatpally': {'price_sqft': 6500, 'growth': 0.08, 'demand': 0.8, 'metro_dist': 0.5},
        'Madhapur': {'price_sqft': 9500, 'growth': 0.15, 'demand': 0.95, 'metro_dist': 1.0},
        'Miyapur': {'price_sqft': 5500, 'growth': 0.07, 'demand': 0.7, 'metro_dist': 0.2},
        'Banjara Hills': {'price_sqft': 15000, 'growth': 0.10, 'demand': 0.85, 'metro_dist': 3.0},
        'Jubilee Hills': {'price_sqft': 18000, 'growth': 0.11, 'demand': 0.9, 'metro_dist': 2.5},
        'Kondapur': {'price_sqft': 8000, 'growth': 0.13, 'demand': 0.88, 'metro_dist': 2.0},
        'Manikonda': {'price_sqft': 6000, 'growth': 0.09, 'demand': 0.75, 'metro_dist': 4.0},
        'Uppal': {'price_sqft': 4500, 'growth': 0.06, 'demand': 0.65, 'metro_dist': 0.1},
        'Ameerpet': {'price_sqft': 7000, 'growth': 0.05, 'demand': 0.7, 'metro_dist': 0.0}
    }
    
    data = []
    for i in range(10000): # 10k Hyderabad records
        loc = np.random.choice(list(locations.keys()))
        meta = locations[loc]
        sqft = np.random.randint(800, 4000)
        bhk = 1 if sqft < 1000 else (2 if sqft < 1800 else (3 if sqft < 2800 else 4))
        bath = bhk if np.random.random() > 0.3 else bhk + 1
        price = (sqft * meta['price_sqft']) / 100000 # In Lakhs
        noise = np.random.normal(0, 0.05 * price)
        metro_factor = (5 - meta['metro_dist']) * 2
        amenity_factor = np.random.randint(0, 10) * 1.5
        final_price = price + noise + metro_factor + amenity_factor
        data.append({
            'location': loc,
            'total_sqft': sqft,
            'bhk': bhk,
            'bath': bath,
            'metro_dist': meta['metro_dist'],
            'price': round(final_price, 2)
        })
    return pd.DataFrame(data)

def process_ames_data():
    ames_path = 'archive/AmesHousing.csv'
    if not os.path.exists(ames_path):
        print("[WARNING] AmesHousing.csv not found.")
        return pd.DataFrame()
    
    df = pd.read_csv(ames_path)
    # Extract and normalize
    ames_df = pd.DataFrame()
    # Neighborhood as location (prefix with 'US_' to distinguish)
    ames_df['location'] = "US_" + df['Neighborhood']
    ames_df['total_sqft'] = df['Gr Liv Area']
    ames_df['bhk'] = df['Bedroom AbvGr']
    # Total baths = Full + 0.5 * Half
    ames_df['bath'] = df['Full Bath'] + 0.5 * df['Half Bath']
    # Default metro_dist for US suburbs (e.g., 5.0km)
    ames_df['metro_dist'] = 5.0
    # Normalize price: USD * 80 / 100,000 = Price in Lakhs
    ames_df['price'] = (df['SalePrice'] * 80) / 100000
    
    print(f"[INFO] Processed {len(ames_df)} records from AmesHousing.")
    return ames_df

def main():
    hyd_df = generate_hyderabad_data()
    ames_df = process_ames_data()
    
    combined_df = pd.concat([hyd_df, ames_df], ignore_index=True)
    
    os.makedirs('ml-service/data', exist_ok=True)
    combined_df.to_csv('ml-service/data/training_data.csv', index=False)
    print(f"[SUCCESS] Total {len(combined_df)} records saved to training_data.csv.")

if __name__ == "__main__":
    main()
