import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';

interface Entity {
  id: number;
  name: string;
  code: string;
  type: string;
  isActive: boolean;
  createdAt: string;
}

interface EntitySelectorProps {
  isCollapsed: boolean;
  onEntityChange?: (entity: Entity) => void;
}

const EntitySelector: React.FC<EntitySelectorProps> = ({
  isCollapsed,
  onEntityChange,
}) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get<{ entities: Entity[] }>('/v1/entities');

        if (response.success && response.data) {
          setEntities(response.data.entities);

          // Set first entity as default if none selected
          if (response.data.entities.length > 0 && !selectedEntity) {
            const defaultEntity = response.data.entities[0];
            setSelectedEntity(defaultEntity);
            onEntityChange?.(defaultEntity);
          }
        } else {
          setError(response.error || 'Failed to fetch entities');
        }
      } catch (err) {
        setError('Failed to fetch entities');
        console.error('Error fetching entities:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntities();
  }, [selectedEntity, onEntityChange]);

  const handleEntityChange = (entityId: string) => {
    const entity = entities.find((e) => e.id.toString() === entityId);
    if (entity) {
      setSelectedEntity(entity);
      onEntityChange?.(entity);
    }
  };

  if (isCollapsed) {
    return (
      <div className="flex items-center justify-center p-2">
        <Building2 className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>Loading entities...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3">
        <div className="flex items-center gap-2 text-sm text-destructive">
          <Building2 className="h-4 w-4" />
          <span>Error loading entities</span>
        </div>
      </div>
    );
  }

  if (entities.length === 0) {
    return (
      <div className="p-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>No entities available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span>Entity</span>
      </div>

      <Select
        value={selectedEntity?.id.toString() || ''}
        onValueChange={handleEntityChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select entity">
            {selectedEntity && (
              <div className="flex items-center gap-2">
                <span className="truncate">{selectedEntity.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {selectedEntity.code}
                </Badge>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {entities.map((entity) => (
            <SelectItem key={entity.id} value={entity.id.toString()}>
              <div className="flex items-center gap-2">
                <span>{entity.name}</span>
                <Badge variant="outline" className="text-xs">
                  {entity.code}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EntitySelector;
