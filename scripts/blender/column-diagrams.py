"""Render original, generic column illustrations. No case reconstruction inputs.

blender -b --factory-startup -P scripts/blender/column-diagrams.py -- --out /tmp/column-diagrams
WebP conversion: cwebp -q 82 input.png -o output.webp
"""
import argparse
import math
import os
import sys
import bpy
from mathutils import Vector

args = argparse.ArgumentParser()
args.add_argument('--out', required=True)
opt = args.parse_args(sys.argv[sys.argv.index('--') + 1:])
os.makedirs(opt.out, exist_ok=True)

COLORS = {'paper':'F7F4EC','ground':'EEECE4','ink':'254F45','sage':'8EA496',
          'gold':'B29B72','red':'AB6150','road':'7D8983','white':'FFFFFF','dark':'34413C'}

def material(key):
    m = bpy.data.materials.get(key)
    if m: return m
    m = bpy.data.materials.new(key); m.use_nodes = True
    h = COLORS[key]
    rgb = [int(h[i:i+2],16)/255 for i in (0,2,4)]
    rgb = [v/12.92 if v <= .04045 else ((v+.055)/1.055)**2.4 for v in rgb]
    shader = m.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*rgb,1)
    shader.inputs['Roughness'].default_value = .7
    return m

def box(name,loc,size,color,bevel=.06):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    obj=bpy.context.object;obj.name=name;obj.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    obj.data.materials.append(material(color))
    if bevel:
        mod=obj.modifiers.new('Soft edges','BEVEL');mod.width=bevel;mod.segments=3
        obj.modifiers.new('Normals','WEIGHTED_NORMAL')
    return obj

def line(x,y,length,z=.27,color='sage'):
    return box('document line',(x,y,z),(length,.06,.015),color,.01)

def sheet(x,y=0,z=.2):
    return box('paper',(x,y,z),(2.7,3.65,.08),'paper',.045)

def number(n,x,y):
    bpy.ops.mesh.primitive_cylinder_add(vertices=64,radius=.34,depth=.06,location=(x,y,.2))
    bpy.context.object.data.materials.append(material('ink'))
    curve=bpy.data.curves.new('number','FONT');curve.body=str(n);curve.align_x='CENTER';curve.align_y='CENTER';curve.size=.4
    obj=bpy.data.objects.new('number',curve);bpy.context.collection.objects.link(obj);obj.location=(x,y,.24);obj.data.materials.append(material('white'))

def car(x,y,color):
    box('car body',(x,y,.37),(.9,1.75,.4),color,.15)
    box('cabin',(x,y-.1,.69),(.73,.86,.4),color,.12)
    box('windscreen',(x,y+.28,.78),(.61,.055,.24),'dark',.025)
    for side in [-.47,.47]:
        for axle in [-.51,.51]: box('wheel',(x+side,y+axle,.25),(.14,.38,.32),'dark',.065)
    for light in [-.29,.29]:box('headlight',(x+light,y+.88,.42),(.17,.025,.10),'paper',.02)

def road(x):
    box('road tile',(x,0,.05),(3.2,6.0,.12),'road',.08)
    for y in [-2.45,-1.65,-.85,-.05,.75,1.55,2.35]:box('lane line',(x,y,.12),(.045,.4,.015),'white',0)
    for dx in [-1.48,1.48]:box('edge',(x+dx,0,.13),(.025,5.8,.01),'white',0)

def setup():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE'
    scene.render.resolution_x=1440;scene.render.resolution_y=840;scene.render.resolution_percentage=100
    scene.render.image_settings.file_format='PNG'
    scene.view_settings.view_transform='Standard'
    scene.world=bpy.data.worlds.new('World');scene.world.use_nodes=True
    scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.8,.8,.8,1)
    scene.world.node_tree.nodes['Background'].inputs[1].default_value=.6
    box('table',(0,0,-.18),(200,200,.2),'ground',0)
    bpy.ops.object.light_add(type='AREA',location=(-5,-3,10));bpy.context.object.data.energy=1350;bpy.context.object.data.shape='DISK';bpy.context.object.data.size=8
    bpy.ops.object.camera_add(location=(0,-10,14))
    camera=bpy.context.object;camera.rotation_euler=(Vector((0,0,0))-camera.location).to_track_quat('-Z','Y').to_euler()
    camera.data.type='ORTHO';camera.data.ortho_scale=13.5;scene.camera=camera
    return scene

def records():
    for x in [-4,0,4]:sheet(x)
    # Diagnosis/medical record, receipts, income records: distinct evidence.
    box('clipboard',(-4,1.74,.31),(1.0,.25,.16),'gold')
    box('medical cross horizontal',(-4,.8,.29),(.82,.23,.04),'ink',.02)
    box('medical cross vertical',(-4,.8,.3),(.23,.82,.04),'ink',.02)
    for y in [-.1,-.5,-.9,-1.3]:line(-4,y,1.95)
    for j in range(3):
        box('receipt',(j*.2-.2,-j*.2,.27+j*.08),(1.65,2.5,.05),'white',.015)
        for y in [.75,.38,0,-.38]:line(j*.2-.2,y-j*.2,1.2,.32+j*.08)
    for i in range(3):
        for j in range(3):box('income table',(3.2+i*.77,.6-j*.6,.26),(.66,.46,.015),'sage',.01)
    line(4,1.3,2.05,color='ink');line(4,-1.3,1.8)

def police():
    for x in [-4,0,4]:sheet(x)
    # Abstract documents, not replicas of official forms or actual records.
    box('registration tab',(-4,1.6,.3),(1.2,.28,.12),'gold')
    for y in [.9,.45,0,-.45,-.9]:line(-4,y,1.9)
    box('map',(-.35,.1,.27),(1.65,2.55,.02),'sage',.02)
    box('map road',(-.6,.1,.29),(.55,2.5,.025),'road',.01)
    box('map crossroad',(-.35,.65,.3),(1.6,.55,.025),'road',.01)
    for y in [-.9,-.45,0,1.1]:box('map lane',(-.6,y,.32),(.025,.2,.01),'white',0)
    for x in [-.95,-.25,.25]:box('map cross lane',(x,.65,.33),(.16,.025,.01),'white',0)
    box('map car',(-.78,-.25,.37),(.14,.28,.1),'ink',.04)
    box('photo border',(.7,-.8,.33),(1.45,1.25,.1),'white',.015)
    box('photo road',(.7,-.8,.4),(1.2,.96,.02),'road',.005)
    box('photo line',(.7,-.8,.43),(.035,.92,.02),'white',0)
    box('report heading',(4,1.25,.3),(2,.25,.025),'ink',.01)
    for y in [.55,.1,-.35,-.8,-1.25]:line(4,y,2)

def passing():
    # Generic two-car positions, no people, contact, location, speed or legal measurements.
    for x in [-4,0,4]:road(x)
    car(-3.25,1.1,'red');car(-3.25,-1.1,'ink')
    car(.75,-.25,'red');car(-.75,.6,'ink')
    car(4.75,-1.2,'red');car(4.75,1.1,'ink')

for name,draw in [('claim-records-3d',records),('police-documents-3d',police),('passing-stages-3d',passing)]:
    scene=setup();draw()
    for n,x in enumerate([-4,0,4],1):number(n,x,-3.65 if name=='passing-stages-3d' else -2.65)
    scene.render.filepath=os.path.join(opt.out,name+'.png')
    bpy.ops.render.render(write_still=True)
    print('RENDERED',name)
