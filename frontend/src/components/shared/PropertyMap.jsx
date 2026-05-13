import { ExternalLink, MapPin } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const VINH_LONG_CENTER = {
  lat: 10.2537,
  lng: 105.9722,
}

const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function toNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function getPosition(coordinates) {
  const lat = toNumber(coordinates?.lat)
  const lng = toNumber(coordinates?.lng)

  if (lat === null || lng === null || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return {
      lat: VINH_LONG_CENTER.lat,
      lng: VINH_LONG_CENTER.lng,
      hasExactCoordinates: false,
    }
  }

  return {
    lat,
    lng,
    hasExactCoordinates: true,
  }
}

export default function PropertyMap({
  coordinates,
  address,
  districtName,
  city = 'Vĩnh Long',
  title,
}) {
  const position = getPosition(coordinates)
  const locationText = [address, districtName, city].filter(Boolean).join(', ')
  const zoom = position.hasExactCoordinates ? 16 : 13
  const osmUrl = `https://www.openstreetmap.org/?mlat=${position.lat}&mlon=${position.lng}#map=${zoom}/${position.lat}/${position.lng}`

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#021f29] flex items-center gap-2">
            <div className="w-2 h-8 bg-[#1565C0] rounded-full"></div>
            Vị trí trên bản đồ
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {locationText || 'Địa chỉ đang được cập nhật'}
          </p>
        </div>

        <a
          href={osmUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 text-sm font-bold text-[#1565C0] transition-colors hover:bg-blue-100"
        >
          Mở trên OpenStreetMap
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {!position.hasExactCoordinates && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Chưa có tọa độ chính xác. Bản đồ đang hiển thị khu vực trung tâm Vĩnh Long.</span>
        </div>
      )}

      <div className="h-[320px] overflow-hidden rounded-3xl border border-gray-100 bg-gray-100 shadow-sm md:h-[420px] [&_.leaflet-control]:!z-10 [&_.leaflet-pane]:!z-0 [&_.leaflet-top]:!z-10">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={zoom}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[position.lat, position.lng]} icon={defaultIcon}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{title || 'Tin đăng Homely'}</p>
                {locationText && <p>{locationText}</p>}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  )
}
