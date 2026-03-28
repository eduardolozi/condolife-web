import { FileSelector } from '@/shared/components/FileSelector'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/imports/resident')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex w-full flex-col justify-center px-3 sm:px-6'>
      <div className='w-full max-w-none py-3 sm:mt-8 sm:py-6 md:max-w-6xl md:self-center'>
        <FileSelector 
          handleSelect={async () => await new Promise(resolve => setTimeout(resolve, 1000))}
          maxSize={1000000}
          supportedExtensions={['.csv', '.txt']}
        />
      </div>
    </div>
  )
}
