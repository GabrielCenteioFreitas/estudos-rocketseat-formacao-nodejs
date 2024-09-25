import { ValueObject } from "@/core/entities/value-object";

interface LocationProps {
  latitude: number;
  longitude: number;
}

export class Location extends ValueObject<LocationProps> {
  get longitude() {
    return this.props.longitude
  }

  get latitude() {
    return this.props.latitude
  }

  get coordinates() {
    return {
      latitude: this.props.latitude,
      longitude: this.props.longitude,
    }
  }

  static create(props: LocationProps) {
    return new Location(props)
  }
}