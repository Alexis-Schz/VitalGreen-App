-- 1. Tabla de Especies (El catálogo de 50+ especies)
CREATE TABLE especies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_comun TEXT NOT NULL,
  nombre_cientifico TEXT,
  riego_dias_invierno INT,
  riego_dias_verano INT,
  luz_requerida TEXT -- 'Baja', 'Media', 'Alta'
);

-- 2. Tabla de Plantas del Usuario
CREATE TABLE plantas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES auth.users(id), -- Vinculado al Login
  especie_id UUID REFERENCES especies(id),
  apodo TEXT NOT NULL,
  salud_actual INT DEFAULT 100, -- La Monstera empezaría aquí
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Historial de acciones (Para saber cuándo se regó por última vez)
CREATE TABLE registros_cuidado (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  planta_id UUID REFERENCES plantas(id) ON DELETE CASCADE,
  accion TEXT NOT NULL, -- 'Riego', 'Abono', 'Poda'
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);