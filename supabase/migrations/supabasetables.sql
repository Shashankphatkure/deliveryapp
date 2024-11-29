-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Managers table
create table managers (
    id uuid primary key default uuid_generate_v4(),
    email text unique not null,
    full_name text not null,
    phone text,
    role text check (role in ('admin', 'supervisor')) default 'supervisor',
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create trigger for updated_at timestamp
create trigger update_managers_updated_at
    before update on managers
    for each row execute function update_updated_at_column(); 


-- Update managers table to include auth fields
ALTER TABLE managers
ADD COLUMN auth_id uuid REFERENCES auth.users(id);

-- Create a function to handle new manager creation
CREATE OR REPLACE FUNCTION handle_new_manager()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO managers (email, full_name, auth_id, role)
    VALUES (NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.id, 'admin');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create manager record
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_manager();     



-- Driver Authentication table (links to delivery_personnel)
create table driver_auth (
    id uuid primary key references delivery_personnel(id),
    password_hash text not null,
    last_login timestamp with time zone,
    reset_token text,
    reset_token_expires timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Notifications table
create table notifications (
    id uuid primary key default uuid_generate_v4(),
    recipient_type text check (recipient_type in ('driver', 'manager', 'customer')),
    recipient_id uuid not null,
    title text not null,
    message text not null,
    is_read boolean default false,
    type text check (type in ('order', 'payment', 'penalty', 'system')),
    created_at timestamp with time zone default now()
);

-- Driver Payments table
create table driver_payments (
    id bigint generated by default as identity not null,
    created_at timestamp with time zone not null default now(),
    paymentstatus text null,
    finalamount bigint null,
    totalkm text null,
    totalorders bigint null,
    advance bigint null,
    penalty bigint null,
    driverid text null,
    processed_orders jsonb,
    constraint driverpayment_pkey primary key (id),
    constraint public_driverpayment_driverid_fkey foreign key (driverid) references delivery_personnel (email)
);

-- Penalties table
create table penalties (
    id uuid primary key default uuid_generate_v4(),
    driver_id uuid references delivery_personnel(id),
    amount decimal(10,2) not null,
    reason text not null,
    status text check (status in ('pending', 'processed', 'disputed', 'cancelled')) default 'pending',
    created_by uuid references managers(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Order Transfer History table
create table order_transfers (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id),
    from_driver_id uuid references delivery_personnel(id),
    to_driver_id uuid references delivery_personnel(id),
    reason text not null,
    transferred_by uuid references managers(id),
    created_at timestamp with time zone default now()
);

-- Add triggers for updated_at
create trigger update_driver_auth_updated_at
    before update on driver_auth
    for each row execute function update_updated_at_column();

create trigger update_driver_payments_updated_at
    before update on driver_payments
    for each row execute function update_updated_at_column();

create trigger update_penalties_updated_at
    before update on penalties
    for each row execute function update_updated_at_column();     



-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Users table (customers)
create table users (
    id uuid primary key default uuid_generate_v4(),
    email text unique not null,
    phone text,
    full_name text,
    address text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Update users table (customers) with additional fields
ALTER TABLE users
ADD COLUMN homeaddress text,
ADD COLUMN workaddress text,
ADD COLUMN city text,
ADD COLUMN status text,
ADD COLUMN ordernote text,
ADD COLUMN subscriptiondays bigint,
ADD COLUMN subscriptionstart date;

-- Restaurants/Stores table
create table stores (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    address text not null,
    phone text,
    image_url text,
    is_active boolean default true,
    opening_time time,
    closing_time time,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Categories table (for menu items)
create table categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    store_id uuid references stores(id) on delete cascade,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Menu Items table
create table menu_items (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    price decimal(10,2) not null,
    image_url text,
    is_available boolean default true,
    store_id uuid references stores(id) on delete cascade,
    category_id uuid references categories(id) on delete set null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Drop existing orders table if exists
DROP TABLE IF EXISTS orders CASCADE;

-- Create new orders table
CREATE TABLE orders (
    id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    driverid uuid NULL,
    customerid uuid NULL,
    start text NULL,
    destination text NULL,
    distance text NULL,
    time text NULL,
    status text NULL,
    driveremail text NULL,
    drivername text NULL,
    customername text NULL,
    managernumber text NULL,
    completiontime text NULL,
    remark text NULL,
    total_amount decimal(10,2) NULL,
    payment_status text CHECK (payment_status in ('pending', 'completed', 'failed')) DEFAULT 'pending',
    payment_method text,
    delivery_notes text,
    payment_processed timestamp with time zone,
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_customerid_fkey FOREIGN KEY (customerid) REFERENCES users(id),
    CONSTRAINT orders_driverid_fkey FOREIGN KEY (driverid) REFERENCES delivery_personnel(id)
) TABLESPACE pg_default;

-- Order Items table
create table order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade,
    menu_item_id uuid references menu_items(id) on delete set null,
    quantity integer not null,
    price_at_time decimal(10,2) not null,
    special_instructions text,
    created_at timestamp with time zone default now()
);

-- Delivery Personnel table
DROP TABLE IF EXISTS delivery_personnel CASCADE;

create table delivery_personnel (
    id uuid primary key default uuid_generate_v4(),
    full_name text not null,
    email text unique not null,
    phone text not null,
    age text,
    photo text,
    aadhar_no text,
    address text,
    current_position text,
    vehicle_number text,
    rating integer,
    bank_account_no text,
    bank_ifsc_code text,
    vehicle_color text,
    status text default 'active',
    city text,
    about_driver text,
    home_phone_number text,
    previous_location text,
    password text,
    vehicle_type text,
    pan_card_number text,
    driving_license text,
    driver_mode text default 'offline',
    is_active boolean default true,
    current_location_lat decimal(10,8),
    current_location_lng decimal(11,8),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Delivery Assignments table
create table delivery_assignments (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade,
    delivery_personnel_id uuid references delivery_personnel(id) on delete set null,
    status text check (status in ('assigned', 'picked_up', 'delivered', 'cancelled')) default 'assigned',
    pickup_time timestamp with time zone,
    delivery_time timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Reviews table
create table reviews (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete set null,
    order_id uuid references orders(id) on delete cascade,
    store_rating integer check (store_rating between 1 and 5),
    delivery_rating integer check (delivery_rating between 1 and 5),
    comment text,
    created_at timestamp with time zone default now()
);

-- Create triggers for updated_at timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to all relevant tables
create trigger update_users_updated_at
    before update on users
    for each row execute function update_updated_at_column();

create trigger update_stores_updated_at
    before update on stores
    for each row execute function update_updated_at_column();

create trigger update_categories_updated_at
    before update on categories
    for each row execute function update_updated_at_column();

create trigger update_menu_items_updated_at
    before update on menu_items
    for each row execute function update_updated_at_column();

create trigger update_orders_updated_at
    before update on orders
    for each row execute function update_updated_at_column();

create trigger update_delivery_personnel_updated_at
    before update on delivery_personnel
    for each row execute function update_updated_at_column();

create trigger update_delivery_assignments_updated_at
    before update on delivery_assignments
    for each row execute function update_updated_at_column();     



-- Penalty Reasons table (for predefined reasons)
create table penalty_reasons (
    id uuid primary key default uuid_generate_v4(),
    reason text not null,
    description text,
    default_amount decimal(10,2),
    is_active boolean default true,
    created_at timestamp with time zone default now()
);

-- Insert some default penalty reasons
INSERT INTO penalty_reasons (reason, description, default_amount) VALUES
('Late Delivery', 'Delivery completed after promised time', 10.00),
('Damaged Package', 'Package was damaged during delivery', 20.00),
('Unprofessional Behavior', 'Complaints about driver behavior', 15.00),
('Vehicle Maintenance', 'Failed to maintain vehicle standards', 25.00),
('Missing Order Items', 'Items reported missing from delivery', 20.00);

-- Update Penalties table
ALTER TABLE penalties
ADD COLUMN order_id bigint REFERENCES orders(id),
ADD COLUMN reason_type text CHECK (reason_type in ('predefined', 'custom')) default 'custom',
ADD COLUMN predefined_reason_id uuid REFERENCES penalty_reasons(id),
ADD COLUMN evidence_url text,
ADD COLUMN driver_response text,
ADD COLUMN resolution_notes text;