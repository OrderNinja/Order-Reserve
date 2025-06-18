
-- Create time_slots table to manage available reservation time slots
CREATE TABLE public.time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 1 = Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 50,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Create time_slot_exceptions table for specific date overrides
CREATE TABLE public.time_slot_exceptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exception_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 50,
  is_available BOOLEAN DEFAULT true,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT valid_exception_time_range CHECK (start_time < end_time)
);

-- Enable Row Level Security 
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slot_exceptions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access and admin write access
CREATE POLICY "Allow public read access to time slots" ON public.time_slots
  FOR SELECT USING (true);

CREATE POLICY "Allow all operations on time slots" ON public.time_slots
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to time slot exceptions" ON public.time_slot_exceptions
  FOR SELECT USING (true);

CREATE POLICY "Allow all operations on time slot exceptions" ON public.time_slot_exceptions
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_time_slots_day_of_week ON time_slots(day_of_week);
CREATE INDEX idx_time_slots_available ON time_slots(is_available);
CREATE INDEX idx_time_slot_exceptions_date ON time_slot_exceptions(exception_date);

-- Insert default time slots (example schedule)
INSERT INTO public.time_slots (day_of_week, start_time, end_time, max_capacity, is_available) VALUES
-- Monday to Friday: Lunch and Dinner slots
(1, '11:30:00', '14:30:00', 30, true), -- Monday Lunch
(1, '17:30:00', '22:00:00', 40, true), -- Monday Dinner
(2, '11:30:00', '14:30:00', 30, true), -- Tuesday Lunch
(2, '17:30:00', '22:00:00', 40, true), -- Tuesday Dinner
(3, '11:30:00', '14:30:00', 30, true), -- Wednesday Lunch
(3, '17:30:00', '22:00:00', 40, true), -- Wednesday Dinner
(4, '11:30:00', '14:30:00', 30, true), -- Thursday Lunch
(4, '17:30:00', '22:00:00', 40, true), -- Thursday Dinner
(5, '11:30:00', '14:30:00', 30, true), -- Friday Lunch
(5, '17:30:00', '22:30:00', 50, true), -- Friday Dinner (extended hours)
-- Weekend: Extended hours
(6, '10:00:00', '15:00:00', 35, true), -- Saturday Brunch/Lunch
(6, '17:00:00', '23:00:00', 50, true), -- Saturday Dinner
(0, '10:00:00', '15:00:00', 35, true), -- Sunday Brunch/Lunch
(0, '17:00:00', '21:30:00', 40, true); -- Sunday Dinner
